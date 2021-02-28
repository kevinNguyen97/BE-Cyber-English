import "reflect-metadata";
import express from "express";
import { singleton } from "tsyringe";
import { handleError, ResponseCode, ResponseData } from "../models/response";
import VocabularyService from "../services/vocabularies.service";
import UnitService from "../services/unit.service";
import BaseRouter from "./baseRouter";
import { User } from "../models/User.model";
import MultipleChoiceService from "../services/multipleChoice.service";
import {
  MultipleChoiceQuestion,
  MultipleChoiceResponseChecked,
} from "../models/MultipleChoice";
import { TProcessing } from "../interfaces/types";

@singleton()
class MultipleChoiceRouter extends BaseRouter {
  constructor(
    private vocabularySev: VocabularyService,
    private multipleChoiceServ: MultipleChoiceService,
    private unitService: UnitService
  ) {
    super();
    this.run();
  }

  run() {
    this.getMethod(
      "/unit/:unit",
      [this.checkAuthThenGetuser],
      this.getQuestion
    );
    this.postMethod(
      "/unit/:unit",
      [
        this.checkAuthThenGetuser,
        this.check("id").isInt(),
        this.check("vocabulary").isString(),
        this.check("answer").isString(),
      ],
      this.checkAnswer
    );
  }
  private getQuestion = async (
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

      const questionsHaveDone = await this.multipleChoiceServ.getAllQuestionHaveDoneByUser(
        user.id
      );

      const mainVoca = await this.multipleChoiceServ.getMultipleChoiceQuestion(
        questionsHaveDone,
        unit
      );

      const subAnswer = await this.vocabularySev.getRandomVocabularies(
        2,
        unit,
        mainVoca.id
      );

      const dataProcess = await this.getProcessMultipleChoice(user, unit);

      responseData.success = true;
      responseData.data = new MultipleChoiceQuestion(
        mainVoca,
        subAnswer,
        dataProcess
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
      const vocabulary = req.body.vocabulary.trim();
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

      const isExact = await this.multipleChoiceServ.checkExactAnswer(
        idVocabulary,
        answer,
        unit
      );

      if (isExact) {
        await this.multipleChoiceServ.storageCheckpointQuestion(
          idVocabulary,
          user.id,
          unit
        );
      }

      const dataProcess = await this.getProcessMultipleChoice(user, unit);

      responseData.success = true;
      responseData.data = new MultipleChoiceResponseChecked(
        vocabulary,
        answer,
        isExact,
        unit,
        dataProcess
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
  private getProcessMultipleChoice = (
    user: User,
    unit: number
  ): Promise<TProcessing> => {
    return new Promise(async (resolve) => {
      const answered = await this.multipleChoiceServ.getAllQuestionHaveDoneByUnit(
        user.id,
        unit
      );
      const total = await this.vocabularySev.getListVocabularyByUnit(unit);
      resolve({ answered: answered.length, total: total ? total.length : 0 });
    });
  };
}

export default MultipleChoiceRouter;
