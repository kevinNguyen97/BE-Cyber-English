import "reflect-metadata";
import mysql from "mysql";
import DBService from "../config/mysql";
import { singleton } from "tsyringe";
import LoggerService from "../config/logger";
import { VocabularyModel } from "../models/vocabulary";
import { promises } from "fs";

@singleton()
class VocabularyService {
  private nameSpace = "VocabularyService";
  private connection: mysql.Pool;
  private allVocabularies: VocabularyModel[] = [];
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

  getAllVocabularies = (): Promise<VocabularyModel[] | null> => {
    return new Promise((resolve, reject) => {
      if (this.allVocabularies && this.allVocabularies.length) {
        resolve(this.allVocabularies);
      } else {
        this.connection.query(`SELECT * FROM vocabularies`, (err, result) => {
          if (err) {
            this.logger.error(this.nameSpace, "", err);
            reject(err);
          } else if (result && result?.length) {
            this.allVocabularies = result.map(
              (item: any) => new VocabularyModel(item)
            );
            resolve(this.allVocabularies);
          } else {
            resolve(null);
          }
        });
      }
    });
  };

  getListVocabularyByUnitID = (
    unitID: number
  ): Promise<VocabularyModel[] | null> => {
    return new Promise(async (resolve, reject) => {
      await this.getAllVocabularies();
      const data = this.allVocabularies.filter((item) => item.unit === unitID);
      if (data) {
        resolve(data);
      } else {
        reject(null);
      }
    });
  };

  getVocabularyDetail = (vocabulary: string): Promise<VocabularyModel | null> => {
    return new Promise(async (resolve, reject) => {
      await this.getAllVocabularies();
      const data = this.allVocabularies.find((item) => item.vocabulary?.toLowerCase() === vocabulary.toLowerCase());
      if (data) {
        resolve(data);
      } else {
        reject(null);
      }
    });
  };
}

export default VocabularyService;
