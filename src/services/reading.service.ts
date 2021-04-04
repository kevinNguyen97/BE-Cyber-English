import "reflect-metadata";
import { singleton } from "tsyringe";
import {
  ParagraphModel,
  ReadingComprehensionQuestions,
  ReadingDiscussionQuestions,
} from "../models/reading.model";
import BaseService from "./base.service";

@singleton()
class ReadingService extends BaseService {
  private listReadingComprehensionQuestions: ReadingComprehensionQuestions[] = [];

  constructor() {
    super();
    this.nameSpace = "ReadingService";
  }

  handleGetAllResult = (
    err: any,
    result: any,
    resolve: any,
    reject: any,
    callBackMap = (item) => item
  ): void => {
    if (err) {
      this.logErr( "", err);
      reject(err);
    }
    if (result && result?.length) {
      const data = result.map(callBackMap);
      resolve(data);
    } else {
      resolve(null);
    }
  };

  getReadingDiscussionQuestions = (): Promise<
    ReadingComprehensionQuestions[]
  > => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM reading_discussion_questions;`,
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          if (result && result.length) {
            this.listReadingComprehensionQuestions = result.map(
              (item: any) => new ReadingComprehensionQuestions(item)
            );
          }
          resolve(this.listReadingComprehensionQuestions);
        }
      );
    });
  };

  getReadingComprehensionQuestionsByUnit = (
    unit: string | number
  ): Promise<ReadingComprehensionQuestions[] | null> => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM reading_comprehension_questions WHERE unit = ${unit};`,
        (err, result) => {
          this.handleGetAllResult(
            err,
            result,
            resolve,
            reject,
            (item: any) => new ReadingComprehensionQuestions(item)
          );
        }
      );
    });
  };

  getReadingDiscussionQuestionsByUnit = (
    unit: string | number
  ): Promise<ReadingDiscussionQuestions[] | null> => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM reading_discussion_questions WHERE unit = ${unit}`,
        (err, result) => {
          this.handleGetAllResult(
            err,
            result,
            resolve,
            reject,
            (item: any) => new ReadingDiscussionQuestions(item)
          );
        }
      );
    });
  };

  getReadingComprehensionQuestionsById = <T>(
    id: string | number
  ): Promise<T | null> => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM reading_comprehension_questions WHERE id = ${id};`,
        (err, result) => {
          this.handleGetAllResult(
            err,
            result,
            resolve,
            reject,
            (item: any) => new ReadingComprehensionQuestions(item)
          );
        }
      );
    });
  };

  getReadingDiscussionQuestionsById = <T>(
    id: string | number
  ): Promise<T | null> => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM reading_discussion_questions WHERE id = ${id}`,
        (err, result) => {
          this.handleGetAllResult(
            err,
            result,
            resolve,
            reject,
            (item: any) => new ReadingDiscussionQuestions(item)
          );
        }
      );
    });
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
