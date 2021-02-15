import "reflect-metadata";
import express from "express";
import { singleton } from "tsyringe";
import { handleError, ResponseCode, ResponseData } from "../models/response";
import RouterModule from "../models/router.model";
import LoggerService from "../config/logger";
import VocabularyService from "../services/vocabularies";
import { IVocabulary } from "../interfaces/vocabulary";

@singleton()
class VocabularyRouter {
  private nameSpace = "VocabularyRouter";
  router: express.IRouter;
  constructor(
    private routerModule: RouterModule,
    private logger: LoggerService,
    private vocabularySev: VocabularyService
  ) {
    this.router = this.routerModule.router;
    this.run();
  }

  log = (data: any, message: string = "") => {
    this.logger.info(this.nameSpace, message, data);
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
          const unitId = req.params.unitID;

          const listVocabulary = await this.vocabularySev.getListVocabularyByID<
            IVocabulary[]
          >(unitId);
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
