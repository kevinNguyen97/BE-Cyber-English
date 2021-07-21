import "reflect-metadata";
import express from "express";
import { singleton } from "tsyringe";
import { handleError, ResponseCode, ResponseData } from "../models/response";
import VocabularyService from "../services/vocabularies.service";
import UnitService from "../services/unit.service";
import BaseRouter from "./baseRouter";
import { User } from "../models/User.model";
import CacheService from "../services/cache.service";
import FlashCardService from "../services/flashCard.service";
import {  FlashCardData } from "../models/FlashCard";

@singleton()
class FlashCardRouter extends BaseRouter {
  constructor(
    private vocabularySev: VocabularyService,
    private unitService: UnitService,
    private cacheServ: CacheService,
    private flashCardServ: FlashCardService
  ) {
    super();
    this.nameSpace = "FlashCardRouter";
    this.run();
  }

  run() {
    this.getMethod("/", [this.checkAuthThenGetuser], this.getFlashCards);
    this.patchMethod(
      "/",
      [
        this.checkAuthThenGetuser,
        this.check("vocabularyId").isInt(),
        this.check("timeRemind").isInt(),
      ],
      this.setRemindTime
    );
    this.deleteMethod(
      "/:id",
      [this.checkAuthThenGetuser],
      this.removeFlashCard
    );
  }

  private getFlashCards = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const user: User = req.body.userData;

      const allFlashCard = await this.flashCardServ.getAllFlashCardOfUser(
        user.id
      );

      const data: FlashCardData[] = [];

      allFlashCard.forEach((item) => {
        const vocabularyItem = this.cacheServ.vocabulary.allData.find(
          (elem) => elem.id === item.vocabularyId
        );
        if (item.remindDay < this.timeNow) {
          data.push(new FlashCardData(item, vocabularyItem));
        }
      });

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

  private setRemindTime = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const user: User = req.body.userData;

      const vocabularyId = Number(req.body.vocabularyId);
      const timeRemind = Number(req.body.timeRemind);

      if (!vocabularyId) {
        return this.handleError(
          resp,
          responseData,
          [`invalid vocabulary`],
          ResponseCode.BAD_REQUEST
        );
      }

      const detailVocabulary = await this.vocabularySev.getVocabularyDetailById(
        vocabularyId
      );

      if (!detailVocabulary) {
        return this.handleError(
          resp,
          responseData,
          [`vocabulary id is not exist`],
          ResponseCode.BAD_REQUEST
        );
      }
      if (detailVocabulary.unit > user.currentUnit) {
        return this.handleError(
          resp,
          responseData,
          [`Authentication`],
          ResponseCode.UNAUTHORIZED
        );
      }

      if (timeRemind < this.timeNow) {
        return this.handleError(
          resp,
          responseData,
          [`invalid time Remind`],
          ResponseCode.BAD_REQUEST
        );
      }

      await this.flashCardServ.setRemindTimeForUser(
        user.id,
        vocabularyId,
        timeRemind
      );

      responseData.success = true;
      responseData.data = `flash card "${detailVocabulary.vocabulary}" added to flash card`;
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

  private removeFlashCard = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const user: User = req.body.userData;

      const id = Number(req.params.id);

      if (!id) {
        return this.handleError(
          resp,
          responseData,
          [`invalid id`],
          ResponseCode.BAD_REQUEST
        );
      }

      const isExistVocabulary = await this.flashCardServ.checkIsExistId(id);

      if (!isExistVocabulary) {
        return this.handleError(
          resp,
          responseData,
          [`flash card id is not exist`],
          ResponseCode.BAD_REQUEST
        );
      }

      await this.flashCardServ.removeFlashCardById(id);

      responseData.success = true;
      responseData.data = `flash card id ${id} was deleted`;
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

export default FlashCardRouter;
