import "reflect-metadata";
import express from "express";
import { singleton } from "tsyringe";
import { handleError, ResponseCode, ResponseData } from "../models/response";
import VocabularyService from "../services/vocabularies.service";
import UnitService from "../services/unit.service";
import BaseRouter from "./baseRouter";
import { User } from "../models/User.model";
import listeningService from "../services/multipleChoice.service";
import { MultipleChoiceResponseChecked } from "../models/MultipleChoice";
import ListeningService from "../services/listening.service";
import { ListeningResponseChecked } from "../models/Listening";

@singleton()
class ListeningComprehension extends BaseRouter {
  constructor(
    private vocabularySev: VocabularyService,
    private listeningServ: ListeningService,
    private unitService: UnitService
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
    this.postMethod(
      "/unit/:unit",
      [
        this.checkAuthThenGetuser,
        this.check("id").isInt(),
        this.check("answer").isString(),
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

      responseData.success = true;
      responseData.data = data;
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
      }

      const answered = await this.listeningServ.getAllQuestionHaveDoneByUnit(
        user.id,
        unit
      );

      const total = await this.vocabularySev.getListVocabularyByUnit(unit);

      responseData.success = true;
      responseData.data = new ListeningResponseChecked(
        idVocabulary,
        unit,
        vocabulary?.audioDictionaryUK,
        vocabulary?.audioDictionaryUS,
        answer,
        isExact,
        answered.length,
        total ? total.length : 0
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
}

export default ListeningComprehension;
