import "reflect-metadata";
import express from "express";
import { singleton } from "tsyringe";
import { handleError, ResponseCode, ResponseData } from "../models/response";
import UnitService from "../services/unit.service";
import ReadingService from "../services/reading.service";
import MediaService from "../services/media.service";
import BaseRouter from "./baseRouter";
import { User } from "../models/User.model";
import { UnitsResponse } from "../models/Units.model";

@singleton()
class UnitRouter extends BaseRouter {
  constructor(
    private unitService: UnitService,
    private readingService: ReadingService,
    private mediaSev: MediaService
  ) {
    super();
    this.init();
  }

  init() {
    this.getMethod("/all", [this.checkAuthThenGetuser], this.getAllUnit);
    this.getMethod(
      "/all-unit-detail",
      [this.checkIsAdmin],
      this.getAllUnitDetail
    );
    this.patchMethod(
      "/update-content",
      [this.checkIsAdmin],
      this.updatenitTitle
    );
  }

  private getAllUnit = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const user: User = req.body.userData;

      const currentUnit = user.currentUnit;
      const listUnits = await this.unitService.getAllUnit();

      const dataResponse = listUnits
        .map((unit) => new UnitsResponse(unit, unit.unit <= currentUnit))
        .sort((a, b) => a.unit - b.unit);

      responseData.success = true;
      responseData.data = dataResponse;
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

  private getAllUnitDetail = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const user: User = req.body.userData;

      const listUnits = await this.unitService.getAllUnit();

      const dataResponse = listUnits.sort((a, b) => a.unit - b.unit);

      responseData.success = true;
      responseData.data = dataResponse;
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

  private updatenitTitle = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const user: User = req.body.userData;

      const currentUnit = user.currentUnit;
      const listUnits = await this.unitService.getAllUnit();

      const dataResponse = listUnits
        .map((unit) => new UnitsResponse(unit, unit.unit <= currentUnit))
        .sort((a, b) => a.unit - b.unit);

      responseData.success = true;
      responseData.data = dataResponse;
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

export default UnitRouter;
