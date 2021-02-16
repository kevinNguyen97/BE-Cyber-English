import "reflect-metadata";
import mysql from "mysql";
import DBService from "../config/mysql";
import { singleton } from "tsyringe";
import LoggerService from "../config/logger";
import { VocabularyModel } from "../models/vocabulary";
import { UnitsModel } from "../models/Units.model";

@singleton()
class UnitService {
  private nameSpace = "UnitService";
  private connection: mysql.Pool;
  private listUnit: UnitsModel[] = [];

  constructor(private dBService: DBService, private logger: LoggerService) {
    this.log('')
    this.connection = this.dBService.getConnection();

  }

  handleGetAllResult = (
    err: any,
    result: any,
    resolve: any,
    reject: any,
    callBackMap = (item) => item
  ): void => {
    if (err) {
      this.logger.error(this.nameSpace, "", err);
      reject(err);
    }
    if (result && result?.length) {
      const data = result.map(callBackMap);
      resolve(data);
    } else {
      resolve(null);
    }
  };

  getAllUnit = (): Promise<UnitsModel[]> => {
    return new Promise((resolve, reject) => {
      if (this.listUnit && this.listUnit.length) {
        resolve(this.listUnit);
      } else {
        this.connection.query(`SELECT * FROM units;`, (err, result) => {
          this.handleGetAllResult(
            err,
            result,
            resolve,
            reject,
            (item: any) => new UnitsModel(item)
          );
        });
      }
    });
  };
  log = (data: any, message: string = "") => {
    this.logger.info(this.nameSpace, message, data);
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
