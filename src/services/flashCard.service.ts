import "reflect-metadata";
import { singleton } from "tsyringe";
import BaseService from "./base.service";
import { FlashCard } from "../models/FlashCard";

@singleton()
class FlashCardService extends BaseService {
  constructor() {
    super();
    this.nameSpace = "FlashCardService";
  }

  getAllFlashCardOfUser = (userId: number, limit: number = 100): Promise<FlashCard[]> => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `select * from flash_card_user fcu where user_id  = ${userId};`,
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result ? result.map((item: any) => new FlashCard(item)) : []);
        }
      );
    });
  };

  setRemindTimeForUser = (
    userId: number,
    vocabularyId: number,
    timeRemind: number
  ): Promise<FlashCard[]> => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `INSERT INTO flash_card_user (created,modified,user_id,vocabulary_id,remind_day)
            VALUES (${this.timeNow},${this.timeNow},${userId},${vocabularyId},${timeRemind})
          ON DUPLICATE KEY UPDATE
            modified = ${this.timeNow},
            remind_day = ${timeRemind};`,
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        }
      );
    });
  };

  checkIsExistId = (
    id: number,
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT count(1) as is_exist FROM flash_card_user WHERE id = ${id};`,
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(!!result[0].is_exist);
        }
      );
    });
  };

  removeFlashCardById = (
    id: number,
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `DELETE FROM flash_card_user WHERE id = ${id};`,
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result && result.length ? true : false);
        }
      );
    });
  };
}

export default FlashCardService;
