import "reflect-metadata";
import express from "express";
import { singleton } from "tsyringe";
import { handleError, ResponseCode, ResponseData } from "../models/response";
import VocabularyService from "../services/vocabularies.service";
import UnitService from "../services/unit.service";
import { VocabularyModel } from "../models/vocabulary";
import BaseRouter from "./baseRouter";

@singleton()
class VocabularyRouter extends BaseRouter {
  constructor(
    private vocabularySev: VocabularyService,
    private unitService: UnitService
  ) {
    super();
    this.run();
  }

  run() {
    this.getMethod(
      "/:unitID",
      [this.isAuth],
      async (
        req: express.Request,
        resp: express.Response,
        next: express.NextFunction,
        responseData: ResponseData<any>
      ) => {
        try {
          const unitId = Number(req.params.unitID);
          const unitIsExist = await this.unitService.checkUnitsExist(unitId);
          if (!unitIsExist)
            return this.handleError(
              resp,
              responseData,
              [`unit ${unitId} is not exist`],
              ResponseCode.BAD_REQUEST
            );
          const listVocabularies = await this.vocabularySev.getListVocabularyByID<
            VocabularyModel[]
          >(unitId);
          if (!listVocabularies)
            return this.handleError(
              resp,
              responseData,
              [
                `doesn't have any vocabulary of unit ${unitId} in database please contact with admin`,
              ],
              ResponseCode.INTERNAL_SERVER_ERROR
            );

          responseData.success = true;
          responseData.data = listVocabularies;
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
