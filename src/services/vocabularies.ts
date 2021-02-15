import "reflect-metadata";
import mysql from "mysql";
import DBService from "../config/mysql";
import { singleton } from "tsyringe";
import LoggerService from "../config/logger";
import { IVocabulary } from '../interfaces/vocabulary/index';

@singleton()
class VocabularyService {
  private nameSpace = "VocabularyService";
  private connection: mysql.Pool;
  constructor(private dBService: DBService, private logger: LoggerService) {
    this.connection = this.dBService.getConnection();
  }

  handleResult = <T>(
    err: any,
    result: T,
    resolve: any,
    reject: any,
    callback = () => {
      resolve(result);
    }
  ): void => {
    if (err) {
      this.logger.error(this.nameSpace, "", err);
      reject(err);
    }
    callback();
  };

  getListVocabularyByID = <T>(id: string | number): Promise<T> => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `select * from vocabularies v where unit = ${id}`,
        (err, result) => this.handleResult<T>(err, result, resolve, reject)
      );
    });
  };
}

export default VocabularyService;
