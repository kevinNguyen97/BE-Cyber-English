import "reflect-metadata";
import mysql from "mysql";
import DBService from "../config/mysql";
import { singleton } from "tsyringe";
import LoggerService from "../config/logger";
import { UserWorkList, VocabularyModel } from "../models/vocabulary";
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

  getAllVocabularies = (): Promise<VocabularyModel[]> => {
    return new Promise((resolve, reject) => {
      if (this.allVocabularies && this.allVocabularies.length) {
        resolve(this.allVocabularies);
      } else {
        this.connection.query(`SELECT * FROM vocabularies`, (err, result) => {
          if (err) {
            this.logger.error(this.nameSpace, "", err);
            reject(err);
            return;
          }
          if (result && result?.length) {
            this.allVocabularies = result.map(
              (item: any) => new VocabularyModel(item)
            );
          }
          resolve(this.allVocabularies.length ? this.allVocabularies : []);
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

  getVocabularyDetail = (
    vocabulary: string
  ): Promise<VocabularyModel | null> => {
    return new Promise(async (resolve, reject) => {
      await this.getAllVocabularies();
      const data = this.allVocabularies.find(
        (item) => item.vocabulary?.toLowerCase() === vocabulary.toLowerCase()
      );
      if (data) {
        resolve(data);
      } else {
        reject(null);
      }
    });
  };

  getWordListbyUserId = (
    userId: number,
    pageSize: number = 0,
    pageIndex: number = 0
  ): Promise<UserWorkList[]> => {
    return new Promise<any>((resolve, reject) => {
      const subQueryPagin = pageSize
        ? `LIMIT ${pageIndex * pageSize},${pageSize}`
        : "";
      this.connection.query(
        `SELECT * FROM user_worklist WHERE user_id = ${userId} ${subQueryPagin}`,
        (err, result) => {
          if (err) {
            this.logger.error(this.nameSpace, "", err);
            reject(err);
          } else if (result) {
            const userWorklist: UserWorkList[] = result.map(
              (item: any) => new UserWorkList(item)
            );
            resolve(userWorklist);
          } else {
            resolve([]);
          }
        }
      );
    });
  };

  getWordListbyId = (id: number): Promise<UserWorkList | null> => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM user_worklist WHERE id = ${id}`,
        (err, result) => {
          if (err) {
            this.logger.error(this.nameSpace, "", err);
            reject(err);
          } else if (result) {
            const userWorklist: UserWorkList = new UserWorkList(result[0]);
            resolve(userWorklist);
          } else {
            resolve(null);
          }
        }
      );
    });
  };

  checkWorklistUserIsExist = (
    userId: number,
    vocabularyId: number
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM user_worklist WHERE user_id = ${userId} AND vocabulary_id = ${vocabularyId}`,
        (err, result) => {
          if (err) {
            this.logger.error(this.nameSpace, "", err);
            return reject(err);
          }
          if (result && result.length) {
            return resolve(true);
          }
          resolve(false);
        }
      );
    });
  };

  checkVocabularyIsExistById = (vocabularyId: number): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
      await this.getAllVocabularies();
      const data = this.allVocabularies.find(
        (item) => item.id === vocabularyId
      );
      data ? resolve(true) : resolve(false);
    });
  };

  addVocabularyToWordList = (
    vocabularyId: number,
    userId: number
  ): Promise<number> => {
    return new Promise(async (resolve, reject) => {
      const timeNow = Date.now();
      this.connection.query(
        `INSERT INTO r4b8weicc0brc2ug.user_worklist (created,modified,vocabulary_id,user_id,is_highlight,is_deleted)
        VALUES (${timeNow},${timeNow},${vocabularyId},${userId},false,false);`,
        (err, result) => {
          if (err) {
            this.logger.error(this.nameSpace, "", err);
            return reject(err);
          }
          if (result) return resolve(Number(result.insertId));
        }
      );
    });
  };
}

export default VocabularyService;
