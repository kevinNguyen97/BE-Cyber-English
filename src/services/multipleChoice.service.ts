import "reflect-metadata";
import { singleton } from "tsyringe";
import BaseService from "./base.service";
import {
  MultipleChoiceHaveDone,
} from "../models/MultipleChoice";
import VocabularyService from "./vocabularies.service";
import { VocabularyModel } from "../models/vocabulary";
import { getRandomInt } from "../ultils/Ultil";
import CacheService from "./cache.service";

@singleton()
class MultipleChoiceService extends BaseService {
  constructor(
    private vocabularyServ: VocabularyService,
    private cacheServ: CacheService
  ) {
    super();
    this.nameSpace = "MultipleChoiceService";
  }

  getAllQuestionHaveDoneByUser = (
    userId: number
  ): Promise<MultipleChoiceHaveDone[]> => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT mcu.id as id, mcu.user_id, mcu.unit as unit_id, v.id as vocabulary_id, mcu.count_replies, mcu.is_checked
              FROM
                mulitple_choice_user mcu
              LEFT JOIN vocabularies v ON
                mcu.vocabulary_id = v.id
              WHERE mcu.user_id = ${userId} AND is_checked = 1;`,
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(
            result
              ? result.map((item: any) => new MultipleChoiceHaveDone(item))
              : []
          );
        }
      );
    });
  };

  getAllQuestionHaveDoneByUnit = (
    userId: number,
    unit: number
  ): Promise<MultipleChoiceHaveDone[]> => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT mcu.id as id, mcu.user_id, mcu.unit as unit_id, v.id as vocabulary_id, mcu.count_replies, mcu.is_checked
              FROM
                mulitple_choice_user mcu
              LEFT JOIN vocabularies v ON
                mcu.vocabulary_id = v.id
              WHERE mcu.user_id = ${userId} AND mcu.unit = ${unit};`,
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(
            result
              ? result.map((item: any) => new MultipleChoiceHaveDone(item))
              : []
          );
        }
      );
    });
  };

  getMultipleChoiceQuestion = (data: any[], unit: number = 1): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const validData = await this.vocabularyServ.fillterVocabularyIsNotExistInArray(
        data,
        unit
      );
      let mainVoca: VocabularyModel;
      if (validData.length) {
        const index = getRandomInt(validData.length);
        mainVoca = validData[index];
      } else {
        const allVocabulariesOfUnit = await this.vocabularyServ.getListVocabularyByUnit(
          unit
        );
        if (!allVocabulariesOfUnit) {
          return reject(null);
        } else {
          const index = getRandomInt(allVocabulariesOfUnit.length);
          mainVoca = allVocabulariesOfUnit[index];
        }
      }
      resolve(mainVoca);
    });
  };

  checkExactAnswer = (
    id: number,
    answer: string,
    unit?: number
  ): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
      const listData = unit
        ? this.cacheServ.vocabulary.getVocabularyByUnit(unit)
        : this.cacheServ.vocabulary.allData;
      if (listData && listData.length) {
        const isExact = !!listData.find(
          (ele) => ele.id === id && ele.dictionaryEntry.trim() === answer
        );
        resolve(isExact);
      } else {
        resolve(false);
      }
    });
  };

  storageCheckpointQuestion = (
    vocabularyId: number,
    userId: number,
    unit: number
  ): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      this.connection.query(
        `INSERT IGNORE INTO mulitple_choice_user (created,modified,user_id,vocabulary_id,unit,count_replies,is_checked)
           VALUES (${this.timeNow},${this.timeNow},${userId},${vocabularyId},${unit},count_replies + 1,1)
           ON DUPLICATE KEY UPDATE
              modified = ${this.timeNow},
              count_replies = IF(is_checked != 1, count_replies + 1, count_replies),
              is_checked = 1;`,
        (err, result) => {
          if (err) {
            this.log(err, "");
            return reject(err);
          }
          if (result) return resolve(Number(result.insertId));
        }
      );
    });
  };

  dispatchWrongAnswer = (
    vocabularyId: number,
    userId: number,
    unit: number
  ): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      this.connection.query(
        `INSERT INTO mulitple_choice_user (created,modified,user_id,vocabulary_id,unit,count_replies)
            VALUES (${this.timeNow},${this.timeNow},${userId},${vocabularyId},${unit}, 1)
          ON DUPLICATE KEY UPDATE
            modified = ${this.timeNow},
            count_replies = IF(is_checked != 1, count_replies + 1, count_replies);`,
        (err, result) => {
          if (err) {
            this.log(err, "");
            return reject(err);
          }
          if (result) return resolve(Number(result.insertId));
        }
      );
    });
  };

  resetTrackingsOnUnit = (
    userId: number,
    unit: number
  ): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      this.connection.query(
        `UPDATE mulitple_choice_user SET modified = ${this.timeNow}, is_checked = 0, count_replies = 0
          WHERE user_id = ${userId} AND unit = ${unit}`,
        (err, result) => {
          if (err) {
            this.log(err, "");
            return reject(err);
          }
          if (result) return resolve(result);
        }
      );
    });
  };
}

export default MultipleChoiceService;
