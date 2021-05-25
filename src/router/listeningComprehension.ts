import "reflect-metadata";
import express from "express";
import { singleton } from "tsyringe";
import { handleError, ResponseCode, ResponseData } from "../models/response";
import VocabularyService from "../services/vocabularies.service";
import UnitService from "../services/unit.service";
import BaseRouter from "./baseRouter";
import { User } from "../models/User.model";
import { ProcessingData } from "../models/MultipleChoice";
import ListeningService from "../services/listening.service";
import UserService from "../services/user.service";
import {
  ListeningQuestionResponses,
  ListeningResponseChecked,
} from "../models/Listening";

@singleton()
class ListeningComprehension extends BaseRouter {
  constructor(
    private vocabularySev: VocabularyService,
    private listeningServ: ListeningService,
    private unitService: UnitService,
    private userService: UserService
  ) {
    super();
    this.run();
  }

  run() {
    this.getMethod(
      "/unit/:unit",
      [this.checkAuthThenGetuser],
      this.getListening
    );
    this.deleteMethod(
      "/unit/:unit",
      [this.checkAuthThenGetuser],
      this.resetTracking
    );
    this.postMethod(
      "/unit/:unit",
      [
        this.checkAuthThenGetuser,
        this.check("id").notEmpty(),
        this.check("answer").notEmpty(),
      ],
      this.checkAnswer
    );
  }
  private getListening = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const user: User = req.body.userData;
      const unit = Number(req.params.unit);

      const isExistUnit = await this.unitService.checkUnitsExist(unit);

      if (!isExistUnit)
        return this.handleError(
          resp,
          responseData,
          [`unit ${unit} is not exist`],
          ResponseCode.BAD_REQUEST
        );

      const listeningHaveDone = await this.listeningServ.getAllQuestionHaveDoneByUser(
        user.id
      );

      const data = await this.listeningServ.getlisteningQuestion(
        listeningHaveDone,
        unit
      );

      const dataProcess = await this.getProcessListening(user, unit);

      responseData.success = true;
      responseData.data = new ListeningQuestionResponses(data, dataProcess);
      return resp.status(ResponseCode.OK).json(responseData);
    } catch (error) {
      return handleError(
        resp,
        ResponseCode.INTERNAL_SERVER_ERROR,
        error,
        this.nameSpace
      );
    }
  };

  private resetTracking = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const user: User = req.body.userData;

      const unit = Number(req.params.unit);

      const isExistUnit = await this.unitService.checkUnitsExist(unit);
      if (!isExistUnit)
        return this.handleError(
          resp,
          responseData,
          [`unit ${unit} is not exist`],
          ResponseCode.BAD_REQUEST
        );

      await this.listeningServ.resetTrackingsOnUnit(user.id, unit);

      const dataProcess = await this.getProcessListening(user, unit);

      responseData.success = true;
      responseData.data = dataProcess;
      return resp.status(ResponseCode.OK).json(responseData);
    } catch (error) {
      return handleError(
        resp,
        ResponseCode.INTERNAL_SERVER_ERROR,
        error,
        this.nameSpace
      );
    }
  };

  private checkAnswer = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const user: User = req.body.userData;
      const unit = Number(req.params.unit);

      const idVocabulary = Number(req.body.id);
      const answer = req.body.answer.trim();

      if (!idVocabulary || !answer || !unit)
        return this.handleError(
          resp,
          responseData,
          [
            `unit ${unit} is not exist || invalid answer || invalid idVocabulary`,
          ],
          ResponseCode.BAD_REQUEST
        );

      const isExact = await this.listeningServ.checkExactAnswer(
        idVocabulary,
        answer,
        unit
      );

      const vocabulary = await this.vocabularySev.getVocabularyDetailById(
        idVocabulary,
        unit
      );

      if (isExact) {
        await this.listeningServ.storageCheckpointQuestion(
          idVocabulary,
          user.id,
          unit
        );
      } else {
        await this.listeningServ.dispatchWrongAnswer(
          idVocabulary,
          user.id,
          unit
        );
      }

      const dataProcess = await this.getProcessListening(user, unit);

      const canUpdateUnit = await this.unitService.canUpdateCurrentUnit(
        user,
        unit,
        "listening",
        dataProcess
      );

      if (canUpdateUnit && unit === user.currentUnit) {
        this.userService.updateCurentUnit(user.id);
      }

      responseData.success = true;
      responseData.data = new ListeningResponseChecked(
        idVocabulary,
        unit,
        vocabulary?.audioDictionaryUK,
        vocabulary?.audioDictionaryUS,
        answer,
        isExact,
        dataProcess,
        vocabulary?.vocabulary
      );
      return resp.status(ResponseCode.OK).json(responseData);
    } catch (error) {
      return handleError(
        resp,
        ResponseCode.INTERNAL_SERVER_ERROR,
        error,
        this.nameSpace
      );
    }
  };
  private getProcessListening = (
    user: User,
    unit: number
  ): Promise<ProcessingData> => {
    return new Promise(async (resolve, reject) => {
      const answered = await this.listeningServ.getAllQuestionHaveDoneByUnit(
        user.id,
        unit
      );
      const countCorected = answered.filter((item) => item.isDone);
      let numberOfReplies = 0;
      for (const iterator of answered) {
        numberOfReplies += iterator.countReplies;
      }
      const total = await this.vocabularySev.getListVocabularyByUnit(unit);
      resolve(
        new ProcessingData(
          countCorected.length,
          total ? total.length : 0,
          numberOfReplies
        )
      );
    });
  };
}

export default ListeningComprehension;


