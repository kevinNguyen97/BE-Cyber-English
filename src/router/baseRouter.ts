import "reflect-metadata";
import express from "express";
import LoggerService from "../config/logger";
import { ResponseData } from "../models/response";
import { ValidationChain, validationResult } from "express-validator";
import { container } from "tsyringe";

class BaseRouter {
  protected nameSpace = "";
  router: express.IRouter;
  private logger: LoggerService = container.resolve(LoggerService);
  constructor() {
    this.router = express.Router();
    this.log("");
  }
  log = (data: any, message: string = "") => {
    this.logger.info(this.nameSpace, message, data);
  };

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

export default BaseRouter;
