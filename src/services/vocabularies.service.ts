import "reflect-metadata";
import { singleton } from "tsyringe";
import {
  T_VocabularyContent,
  UserWorkList,
  VocabularyModel,
} from "../models/vocabulary";
import { getRandomInt, toSingular } from "../ultils/Ultil";
import BaseService from "./base.service";
import "ts-replace-all";
import CacheService from "./cache.service";
@singleton()
class VocabularyService extends BaseService {
  constructor(private cacheServ: CacheService) {
    super();
    this.nameSpace = "VocabularyService";
  }

  getListVocabularyByUnitID = (
    id: number
  ): Promise<VocabularyModel[] | null> => {
    return new Promise(async (resolve, reject) => {
      const data = this.cacheServ.vocabulary.allData.filter(
        (item) => item.id === id
      );
      if (data) {
        resolve(data);
      } else {
        reject(null);
      }
    });
  };

  getListVocabularyByUnit = (unit: number): Promise<VocabularyModel[]> => {
    return new Promise(async (resolve, reject) => {
      const data: VocabularyModel[] = this.cacheServ.vocabulary.getVocabularyByUnit(
        unit
      );
      resolve(data);
    });
  };

  getVocabularyDetail = (
    vocabulary: string
  ): Promise<VocabularyModel | null> => {
    return new Promise(async (resolve, reject) => {
      const data = this.cacheServ.vocabulary.allData.find((item) => {
        return item.vocabulary
          ?.toLowerCase()
          .includes(vocabulary.toLowerCase());
      });
      if (data) {
        resolve(data);
      } else {
        reject(null);
      }
    });
  };

  getVocabularyDetailInUnit = (
    vocabulary: string,
    unit: number
  ): Promise<VocabularyModel | null> => {
    return new Promise(async (resolve, reject) => {
      const listData = await this.getListVocabularyByUnit(unit);
      const data = listData?.find((item) => {
        const isInclude = toSingular(item.vocabulary?.toLowerCase()).includes(
          toSingular(vocabulary.toLowerCase())
        );
        if (isInclude) {
          return true;
        }
        return toSingular(vocabulary.toLowerCase()).includes(
          toSingular(item.vocabulary?.toLowerCase())
        );
      });
      if (data) {
        resolve(data);
      } else {
        reject(null);
      }
    });
  };

  getVocabularyDetailById = (
    id: number,
    unit?: number
  ): Promise<VocabularyModel | null> => {
    return new Promise(async (resolve, reject) => {
      const data = unit
        ? this.cacheServ.vocabulary
            .getVocabularyByUnit(unit)
            ?.find((item) => item.id === id)
        : this.cacheServ.vocabulary.allData.find((item) => item.id === id);
      if (data) {
        resolve(data);
      } else {
        reject("invalid vocabulary id");
      }
    });
  };

  getWordListbyUserId = (
    userId: number,
    pageSize: number = 0,
    pageIndex: number = 0
  ): Promise<{ data: UserWorkList[]; total: number }> => {
    return new Promise<any>((resolve, reject) => {
      const subQueryPagin = pageSize
        ? `LIMIT ${pageIndex * pageSize},${pageSize}`
        : "";

      this.connection.query(
        `SELECT *, (SELECT count(1) FROM user_worklist WHERE user_id = ${userId} AND is_deleted = 0) as totalWordList FROM user_worklist WHERE user_id = ${userId} AND is_deleted = 0 ${subQueryPagin}`,
        (err, result) => {
          let total = 0;
          if (err) {
            this.log(err, "");
            reject(err);
          } else if (result && result.length) {
            const userWorklist: UserWorkList[] = result.map(
              (item: any) => new UserWorkList(item)
            );
            total = Number(result[0].totalWordList);
            resolve({ data: userWorklist, total });
          } else {
            resolve({ data: [], total });
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
            this.log(err, "");
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
        `SELECT * FROM user_worklist WHERE user_id = ${userId} AND vocabulary_id = ${vocabularyId} AND is_deleted = 0`,
        (err, result) => {
          if (err) {
            this.log(err, "");
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
      const data = this.cacheServ.vocabulary.allData.find(
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
      this.connection.query(
        `INSERT INTO user_worklist (created,modified,vocabulary_id,user_id,is_highlight,is_deleted)
        VALUES (${this.timeNow},${this.timeNow},${vocabularyId},${userId},false,false)
      ON DUPLICATE KEY UPDATE
        modified = ${this.timeNow},
        is_deleted = false,
        is_highlight = false;`,
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

  deleteWordList = (worklistId: number): Promise<number> => {
    return new Promise(async (resolve, reject) => {
      this.connection.query(
        `UPDATE user_worklist SET modified=${this.timeNow},is_highlight=false,is_deleted=true WHERE id=${worklistId};`,
        (err, result) => {
          if (err) {
            this.log(err, "");
            return reject(err);
          }
          if (result) return resolve(worklistId);
        }
      );
    });
  };

  highlightWordList = (worklistId: number): Promise<number> => {
    return new Promise(async (resolve, reject) => {
      this.connection.query(
        `UPDATE user_worklist SET modified=${this.timeNow},is_deleted=0,is_highlight=if(is_highlight=0,1,0) WHERE id=${worklistId};`,
        (err, result) => {
          if (err) {
            this.log(err, "");
            return reject(err);
          }
          if (result) return resolve(worklistId);
        }
      );
    });
  };

  fillterVocabularyIsNotExistInArray = (
    data: any[],
    unit: number = 1
  ): Promise<VocabularyModel[]> => {
    return new Promise(async (resolve, reject) => {
      if (!data) {
        reject(false);
      } else if (!data.length) {
        const dataResult = await this.getListVocabularyByUnit(unit);
        resolve(dataResult ? dataResult : []);
      } else {
        const dataUnit = await this.getListVocabularyByUnit(unit);
        const dataResult = dataUnit?.filter((item) =>
          data.findIndex((elem) => elem.vocabularyId === item.id) === -1
            ? true
            : false
        );
        resolve(dataResult ? dataResult : []);
      }
    });
  };

  getRandomVocabularies = (
    quantity: number,
    unit: number = 1,
    ignoreId?: number
  ): Promise<VocabularyModel[]> => {
    return new Promise(async (resolve) => {
      const data: VocabularyModel[] = [];
      const vocaUnit = await this.getListVocabularyByUnit(unit);
      if (!vocaUnit) {
        return resolve([]);
      }
      for (let ele = 0; ele < quantity; ele++) {
        const index = getRandomInt(vocaUnit.length);
        const elem = vocaUnit[index];
        if (
          elem.id === ignoreId ||
          data.findIndex((item) => item.id === elem.id) !== -1
        ) {
          ele--;
          continue;
        }
        data.push(vocaUnit[index]);
      }
      resolve(data);
    });
  };

  updateVocabularyById = (
    id: number,
    body: T_VocabularyContent
  ): Promise<any> =>
    new Promise(async (resolve, reject) => {
      const feildTranslate = "`translate`";
      this.connection.query(
        `UPDATE vocabularies
        SET modified=${this.timeNow},dictionary_entry_translate='${body.dictionaryEntryTranslate}',
            vocabulary='${body.vocabulary}',example_sentences='${body.exampleSentences}',
            ${feildTranslate}='${body.vocabularyTranslate}',example_sentences_translate='${body.exampleSentencesTranslate}',
            dictionary_entry='${body.dictionaryEntry}'
        WHERE id=${id};`,
        (err, result) => {
          if (err) {
            this.log(err, "");
            return reject(err);
          }
          if (result) {
            return resolve({
              id,
              ...body,
            });
          } else {
            return resolve(null);
          }
        }
      );
    });

  newVocabulary = (
    unit,
    userId: number,
    dataBody: T_VocabularyContent
  ): Promise<number> =>
    new Promise((resolve, reject) => {
      const dataInsert = [
        this.timeNow,
        this.timeNow,
        dataBody.dictionaryEntryTranslate,
        dataBody.vocabulary,
        dataBody.exampleSentences,
        dataBody.vocabularyTranslate,
        dataBody.exampleSentencesTranslate,
        dataBody.dictionaryEntry,
        userId,
        unit,
      ];
      const feildTranslate = "`translate`";
      this.connection.query(
        `INSERT INTO vocabularies (modified,created,dictionary_entry_translate,vocabulary,example_sentences,
              ${feildTranslate},example_sentences_translate,dictionary_entry,author, unit)
            VALUES (?);`,
        [dataInsert],
        (err, result) => {
          if (err) {
            this.log(err, "");
            return reject(err);
          }
          if (result && result.insertId) {
            return resolve(result.insertId);
          } else {
            return resolve(0);
          }
        }
      );
    });
}

export default VocabularyService;
