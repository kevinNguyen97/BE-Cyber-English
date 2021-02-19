import "reflect-metadata";
import express from "express";
import { Lifecycle, scoped } from "tsyringe";
import { ResponseData } from "./response";
import { ValidationChain, validationResult } from "express-validator";

@scoped(Lifecycle.ResolutionScoped)
class RouterModule {
  router: express.IRouter;
  constructor() {
    this.router = express.Router();
  }

  getMethod = async (
    path: string,
    middelWare: ValidationChain[],
    mainFunction
  ) => {
    const flow = async (
      req: express.Request,
      resp: express.Response,
      next: express.NextFunction
    ) => {
      return this.baseFlow(req, resp, next, mainFunction);
    };
    this.router.get(path, middelWare, flow);
  };

  postMethod = async (
    path: string,
    middelWare: ValidationChain[],
    mainFunction
  ) => {
    const flow = async (
      req: express.Request,
      resp: express.Response,
      next: express.NextFunction
    ) => {
      return this.baseFlow(req, resp, next, mainFunction);
    };
    this.router.post(path, middelWare, flow);
  };

  baseFlow(
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    mainFunction
  ): express.Response {
    const responseData = new ResponseData<any>();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return resp.status(400).json({
        data: {
          error_codes: ["bad_request"],
        },
        success: false,
      });
    }
    return mainFunction(req, resp, next, responseData);
  }
}

export default RouterModule;
