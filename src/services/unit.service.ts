import "reflect-metadata";
import mysql from "mysql";
import DBService from "../config/mysql";
import { singleton } from "tsyringe";
import LoggerService from "../config/logger";
import { UnitsModel } from "../models/Units.model";
import BaseService from "./base.service";

@singleton()
class UnitService extends BaseService{
  private listUnit: UnitsModel[] = [];

  constructor() {
    super();
    this.nameSpace = "UnitService";
  }

  getAllUnit = (): Promise<UnitsModel[]> => {
    return new Promise((resolve, reject) => {
      if (this.listUnit && this.listUnit.length) {
        resolve(this.listUnit);
      } else {
        this.connection.query(`SELECT * FROM units;`, (err, result) => {
          if (err) {
            this.log(err, "");
            return reject(err);
          }
          resolve(
            result && result.length
              ? result.map((item: any) => new UnitsModel(item))
              : []
          );
        });
      }
    });
  };

  checkUnitsExist = (unit: number): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      const allUnit = await this.getAllUnit();
      const isExist = allUnit.find((item) => item.unit === unit);
      resolve(!!isExist);
    });
  };

  getUnitDetail = (unit: number): Promise<UnitsModel | undefined> => {
    return new Promise(async (resolve, reject) => {
      const allUnit = await this.getAllUnit();
      const isExist = allUnit.find((item) => item.unit === unit);
      resolve(isExist);
    });
  };
}

export default UnitService;
