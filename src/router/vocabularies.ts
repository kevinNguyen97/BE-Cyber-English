import "reflect-metadata";
import express from "express";
import { singleton } from "tsyringe";
import { handleError, ResponseCode, ResponseData } from "../models/response";
import RouterModule from "../models/router.model";

@singleton()
class VocabularyRouter {
  private nameSpace = "VocabularyRouter";
  router: express.IRouter;
  constructor(
    private routerModule: RouterModule
  ) {
    this.router = this.routerModule.router;
    this.run(this.router);
  }

  run(router: express.IRouter) {
    // code
    this.routerModule.postMethod(
      "/vocabulary/:unitID",
      [],
      this.getListVocabularyByUnit
    );
  }

  getListVocabularyByUnit = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const unitId = req.params.unitID;
      console.log(unitId);

      responseData.success = false;
      responseData.data = null;
      return resp.status(ResponseCode.UNAUTHORIZED).json(responseData);
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

export default VocabularyRouter;
