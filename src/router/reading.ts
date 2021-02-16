import "reflect-metadata";
import express from "express";
import { container, singleton } from "tsyringe";
import { handleError, ResponseCode, ResponseData } from "../models/response";
import RouterModule from "../models/router.model";
import LoggerService from "../config/logger";
import UnitService from "../services/unit.service";
import ReadingService from "../services/reading.service";
import { ParagraphModel, ReadingResponseModel } from "../models/reading.model";
import MediaService from "../services/media.service";

@singleton()
class ReadingRouter {
  private nameSpace = "ReadingRouter";
  routerModule: any;
  router: express.IRouter;
  constructor(
    private logger: LoggerService,
    private unitService: UnitService,
    private readingService: ReadingService,
    private mediaSev: MediaService
    ) {
    this.routerModule = container.resolve(RouterModule),
    this.log('')
    this.router = this.routerModule.router;
    this.run();
  }

  log = (data: any, message: string = "") => {
    this.logger.info(this.nameSpace, message, data);
  };

  handleError = (
    resp: express.Response,
    responseData: ResponseData<any>,
    errorMessage: string[],
    errorCode: ResponseCode
  ) => {
    responseData.data = null;
    responseData.success = false;
    responseData.errorCodes = errorMessage;
    return resp.status(errorCode).json(responseData);
  };

  run() {
    this.routerModule.getMethod(
      "/:unit",
      [],
      async (
        req: express.Request,
        resp: express.Response,
        next: express.NextFunction,
        responseData: ResponseData<any>
      ) => {
        try {
          const unit = Number(req.params.unit);
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
          const media = await this.mediaSev.getMediaReadingByUnit(unit);
          console.log(media)
          const data = new ReadingResponseModel(unitDetail, media, paragraphs);
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
