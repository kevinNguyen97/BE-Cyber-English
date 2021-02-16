import "reflect-metadata";
import mysql from "mysql";
import DBService from "../config/mysql";
import { singleton } from "tsyringe";
import LoggerService from "../config/logger";
import { UnitsModel } from "../models/Units.model";
import { ParagraphModel } from "../models/reading.model";

@singleton()
class ReadingService {
  private nameSpace = "ReadingService";
  private connection: mysql.Pool;
  private listUnit: UnitsModel[] = [];

  constructor(private dBService: DBService, private logger: LoggerService) {
    this.log('')
    this.connection = this.dBService.getConnection();
  }
  log = (data: any, message: string = "") => {
    this.logger.info(this.nameSpace, message, data);
  };
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

  getReadingByID = <T>(unit: string | number): Promise<T | null> => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM paragraphs WHERE unit = ${unit}`,
        (err, result) => {
          this.handleGetAllResult(
            err,
            result,
            resolve,
            reject,
            (item: any) => new ParagraphModel(item)
          );
        }
      );
    });
  };
}

export default ReadingService;
