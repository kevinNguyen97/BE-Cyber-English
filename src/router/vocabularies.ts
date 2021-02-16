import "reflect-metadata";
import express from "express";
import { container, Lifecycle, scoped, singleton } from "tsyringe";
import { handleError, ResponseCode, ResponseData } from "../models/response";
import RouterModule from "../models/router.model";
import LoggerService from "../config/logger";
import VocabularyService from "../services/vocabularies.service";
import { IVocabulary } from "../interfaces/vocabulary";
import UnitService from "../services/unit.service";
import { VocabularyModel } from '../models/vocabulary';

@singleton()
class VocabularyRouter {
  private nameSpace = "VocabularyRouter";
  routerModule: any;
  router: express.IRouter;
  constructor(
    private logger: LoggerService,
    private vocabularySev: VocabularyService,
    private unitService: UnitService
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
      "/:unitID",
      [],
      async (
        req: express.Request,
        resp: express.Response,
        next: express.NextFunction,
        responseData: ResponseData<any>
      ) => {
        try {
          const unitId = Number(req.params.unitID);
          this.log(unitId)
          const unitIsExist = await this.unitService.checkUnitsExist(unitId);
          if (!unitIsExist)
            return this.handleError(
              resp,
              responseData,
              [`unit ${unitId} is not exist`],
              ResponseCode.BAD_REQUEST
            );
          const listVocabulary = await this.vocabularySev.getListVocabularyByID<
            VocabularyModel[]
          >(unitId);
          if (!listVocabulary)
            return this.handleError(
              resp,
              responseData,
              [`doesn't have any vocabulary of unit ${unitId} in database please contact with admin`],
              ResponseCode.INTERNAL_SERVER_ERROR
            );

          responseData.success = true;
          responseData.data = listVocabulary;
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

export default VocabularyRouter;
