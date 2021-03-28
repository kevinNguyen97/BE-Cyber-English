import "reflect-metadata";
import express from "express";
import { singleton } from "tsyringe";
import { handleError, ResponseCode, ResponseData } from "../models/response";
import UnitService from "../services/unit.service";
import ReadingService from "../services/reading.service";
import { ParagraphModel, ReadingResponseModel } from "../models/reading.model";
import MediaService from "../services/media.service";
import BaseRouter from "./baseRouter";

@singleton()
class ReadingRouter extends BaseRouter {
  constructor(
    private unitService: UnitService,
    private readingService: ReadingService,
    private mediaSev: MediaService
  ) {
    super();
    this.init();
  }

  init() {
    this.getMethod(
      "/unit/:unit",
      [this.checkAuthThenGetuser],
      async (
        req: express.Request,
        resp: express.Response,
        next: express.NextFunction,
        responseData: ResponseData<any>
      ) => {
        try {
          const unit = Number(req.params.unit);
          if (!unit) {
            next();
          }
          const unitDetail = await this.unitService.getUnitDetail(unit);

          if (!unitDetail)
            return this.handleError(
              resp,
              responseData,
              [`unit ${unit} is not exist`],
              ResponseCode.BAD_REQUEST
            );
          const paragraphs = await this.readingService.getReadingByID<
            ParagraphModel[]
          >(unit);
          if (!paragraphs)
            return this.handleError(
              resp,
              responseData,
              [
                `doesn't have any paragraphs of unit ${unit} in database please contact with admin`,
              ],
              ResponseCode.INTERNAL_SERVER_ERROR
            );

          const discussionQuestions = await this.readingService.getReadingDiscussionQuestionsByUnit(
            unit
          );
          const readingComprehensionQuestions = await this.readingService.getReadingComprehensionQuestionsByUnit(
            unit
          );

          const media = await this.mediaSev.getMediaReadingByUnit(unit);

          const data = new ReadingResponseModel(
            unitDetail,
            media,
            paragraphs,
            discussionQuestions,
            readingComprehensionQuestions
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
      }
    );
  }


}

export default ReadingRouter;
