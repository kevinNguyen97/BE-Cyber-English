import "reflect-metadata";
import mysql from "mysql";
import DBService from "../config/mysql";
import { singleton } from "tsyringe";
import LoggerService from "../config/logger";
import { VocabularyModel } from "../models/vocabulary";

@singleton()
class VocabularyService {
  private nameSpace = "VocabularyService";
  private connection: mysql.Pool;
  constructor(private dBService: DBService, private logger: LoggerService) {
    this.connection = this.dBService.getConnection();
    this.log("");
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

  getListVocabularyByID = <T>(id: string | number): Promise<T | null> => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM vocabularies WHERE unit = ${id}`,
        (err, result) => {
          this.handleGetAllResult(
            err,
            result,
            resolve,
            reject,
            (item: any) => new VocabularyModel(item)
          );
        }
      );
    });
  };
}

export default VocabularyService;
