import "reflect-metadata";
import express from "express";
import { singleton } from "tsyringe";
import { handleError, ResponseCode, ResponseData } from "../models/response";
import VocabularyService from "../services/vocabularies.service";
import UnitService from "../services/unit.service";
import BaseRouter from "./baseRouter";
import { User } from "../models/User.model";
import CacheService from "../services/cache.service";
import { T_VocabularyContent } from "../models/vocabulary";
import { doubleQuotationMark } from "../ultils/Ultil";

@singleton()
class VocabularyRouter extends BaseRouter {
  constructor(
    private vocabularySev: VocabularyService,
    private unitService: UnitService,
    private cacheServ: CacheService
  ) {
    super();
    this.run();
  }

  run() {
    this.getMethod(
      "/unit/:unit",
      [this.checkAuthThenGetuser],
      async (
        req: express.Request,
        resp: express.Response,
        next: express.NextFunction,
        responseData: ResponseData<any>
      ) => {
        try {
          const unit = Number(req.params.unit);
          const unitIsExist = await this.unitService.checkUnitsExist(unit);
          if (!unitIsExist)
            return this.handleError(
              resp,
              responseData,
              [`unit ${unit} is not exist`],
              ResponseCode.BAD_REQUEST
            );
          const listVocabularies = await this.vocabularySev.getListVocabularyByUnit(
            unit
          );
          if (!listVocabularies)
            return this.handleError(
              resp,
              responseData,
              [
                `doesn't have any vocabulary of unit ${unit} in database please contact with admin`,
              ],
              ResponseCode.INTERNAL_SERVER_ERROR
            );

          responseData.success = true;
          responseData.data = listVocabularies;
          return resp.status(ResponseCode.OK).json(responseData);
        } catch (error) {
          return handleError(
            resp,
            ResponseCode.INTERNAL_SERVER_ERROR,
            error,
            this.nameSpace
          );
        }
      }
    );

    this.postMethod(
      "/details/:unit",
      [this.checkAuthThenGetuser, this.check("vocabulary").isString()],
      this.getVocabularyDetails
    );

    this.getMethod(
      "/details/:unit/:id",
      [this.checkAuthThenGetuser],
      this.getVocabularyDetailsById
    );

    this.getMethod(
      "/word-list/:page_size/:page_index",
      [this.checkAuthThenGetuser],
      this.getWordListbyUserId
    );

    this.postMethod(
      "/word-list",
      [this.checkAuthThenGetuser],
      this.addWordList
    );

    this.deleteMethod(
      "/word-list/:wordlist_id",
      [this.checkAuthThenGetuser],
      this.deleteWordList
    );

    this.patchMethod(
      "/word-list/:wordlist_id",
      [this.checkAuthThenGetuser],
      this.highlightWordList
    );

    this.patchMethod(
      "/update-content/:vocabularyId",
      [
        this.checkIsAdmin,
        this.check("vocabulary").isString(),
        this.check("vocabularyTranslate").isString(),
        this.check("dictionaryEntry").isString(),
        this.check("dictionaryEntryTranslate").isString(),
        this.check("exampleSentences").isString(),
        this.check("exampleSentencesTranslate").isString(),
      ],
      this.updateVocabulary
    );

    this.postMethod(
      "/new/:unit",
      [
        this.checkIsAdmin,
        this.check("vocabulary").isString(),
        this.check("vocabularyTranslate").isString(),
        this.check("dictionaryEntry").isString(),
        this.check("dictionaryEntryTranslate").isString(),
        this.check("exampleSentences").isString(),
        this.check("exampleSentencesTranslate").isString(),
      ],
      this.newVocabulary
    );

    this.deleteMethod(
      "/vocabulary/:id",
      [this.checkIsAdmin],
      this.newVocabulary
    );
  }

  private getVocabularyDetails = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const unit = Number(req.params.unit);
      const vocabulary = String(req.body.vocabulary).trim();

      if (!vocabulary || !unit) {
        return this.handleError(
          resp,
          responseData,
          [`invalid vocabulary | unit`],
          ResponseCode.BAD_REQUEST
        );
      }

      const isExistUnit = await this.unitService.checkUnitsExist(unit);
      if (!isExistUnit) {
        return this.handleError(
          resp,
          responseData,
          [`unit ${unit} is not exist`],
          ResponseCode.BAD_REQUEST
        );
      }

      const vocabularyDetails = await this.vocabularySev.getVocabularyDetailInUnit(
        vocabulary,
        unit
      );

      if (!vocabulary) {
        return this.handleError(
          resp,
          responseData,
          [`vocabulary is not exist`],
          ResponseCode.BAD_REQUEST
        );
      }

      responseData.success = true;
      responseData.data = vocabularyDetails;
      return resp.status(ResponseCode.OK).json(responseData);
    } catch (error) {
      return handleError(
        resp,
        ResponseCode.INTERNAL_SERVER_ERROR,
        error,
        this.nameSpace
      );
    }
  };

  private getVocabularyDetailsById = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const unit = Number(req.params.unit);
      const vocabularyId = Number(req.params.id);

      if (!vocabularyId || !unit) {
        return this.handleError(
          resp,
          responseData,
          [`invalid vocabulary | unit`],
          ResponseCode.BAD_REQUEST
        );
      }

      const isExistUnit = await this.unitService.checkUnitsExist(unit);
      if (!isExistUnit) {
        return this.handleError(
          resp,
          responseData,
          [`unit ${unit} is not exist`],
          ResponseCode.BAD_REQUEST
        );
      }

      const vocabularyDetails = await this.vocabularySev.getVocabularyDetailById(
        vocabularyId,
        unit
      );

      if (!vocabularyDetails) {
        return this.handleError(
          resp,
          responseData,
          [`invaild and unit`],
          ResponseCode.BAD_REQUEST
        );
      }

      responseData.success = true;
      responseData.data = vocabularyDetails;
      return resp.status(ResponseCode.OK).json(responseData);
    } catch (error) {
      return handleError(
        resp,
        ResponseCode.INTERNAL_SERVER_ERROR,
        error,
        this.nameSpace
      );
    }
  };

  private getWordListbyUserId = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const user: User = req.body.userData;

      const pageSize: number = Number(req.params.page_size)
        ? Number(req.params.page_size)
        : 0;
      const pageIndex: number = Number(req.params.page_index)
        ? Number(req.params.page_index)
        : 0;

      const dataWordlist = await this.vocabularySev.getWordListbyUserId(
        user.id,
        pageSize,
        pageIndex
      );

      const vocabularies = this.cacheServ.vocabulary.allData;

      const wordList = dataWordlist.data.map((item) => {
        const vocabulary = vocabularies.find(
          (voca) => voca.id === item.vocabularyId
        );
        return {
          wordlistId: item.id,
          created: item.created,
          modified: item.modified,
          vocabularyId: vocabulary?.id,
          vocabulary: vocabulary?.vocabulary,
          translate: vocabulary?.translate,
          isHighlight: item.isHighlight,
          isDeleted: item.isDeleted,
        };
      });
      responseData.success = true;
      responseData.data = {
        wordList,
        pagination: {
          pageSize,
          pageIndex,
          total: dataWordlist.total,
        },
      };
      return resp.status(ResponseCode.OK).json(responseData);
    } catch (error) {
      return handleError(
        resp,
        ResponseCode.INTERNAL_SERVER_ERROR,
        error,
        this.nameSpace
      );
    }
  };

  private addWordList = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const user: User = req.body.userData;

      const vocabularyId = Number(req.body.vocabulary_id);

      if (!vocabularyId) {
        return this.handleError(
          resp,
          responseData,
          [`invalid vocabulary`],
          ResponseCode.BAD_REQUEST
        );
      }

      const isExistVocabulary = await this.vocabularySev.checkVocabularyIsExistById(
        vocabularyId
      );

      if (!isExistVocabulary) {
        return this.handleError(
          resp,
          responseData,
          [`vocabulary id is not exist`],
          ResponseCode.BAD_REQUEST
        );
      }

      const isExistWordList = await this.vocabularySev.checkWorklistUserIsExist(
        user.id,
        vocabularyId
      );
      if (isExistWordList) {
        return this.handleError(
          resp,
          responseData,
          [`wordlist is exist`],
          ResponseCode.BAD_REQUEST
        );
      }
      const idAdded = await this.vocabularySev.addVocabularyToWordList(
        vocabularyId,
        user.id
      );

      const dataAdded = await this.vocabularySev.getWordListbyId(idAdded);
      if (!dataAdded) {
        return this.handleError(
          resp,
          responseData,
          [`INTERNAL SERVER ERROR`],
          ResponseCode.INTERNAL_SERVER_ERROR
        );
      }
      responseData.success = true;
      responseData.data = dataAdded;
      return resp.status(ResponseCode.OK).json(responseData);
    } catch (error) {
      return handleError(
        resp,
        ResponseCode.INTERNAL_SERVER_ERROR,
        error,
        this.nameSpace
      );
    }
  };

  private deleteWordList = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const wordlistId = Number(req.params.wordlist_id);

      if (!wordlistId) {
        return this.handleError(
          resp,
          responseData,
          [`invalid wordlist Id`],
          ResponseCode.BAD_REQUEST
        );
      }

      const wordList = await this.vocabularySev.getWordListbyId(wordlistId);

      if (!wordList) {
        return this.handleError(
          resp,
          responseData,
          [`wordlist is exist`],
          ResponseCode.BAD_REQUEST
        );
      }

      const idWordlistdeleted = await this.vocabularySev.deleteWordList(
        wordList.id
      );
      if (!idWordlistdeleted) {
        return this.handleError(
          resp,
          responseData,
          [`INTERNAL SERVER ERROR`],
          ResponseCode.INTERNAL_SERVER_ERROR
        );
      }

      const dataDeleted = await this.vocabularySev.getWordListbyId(
        idWordlistdeleted
      );
      responseData.success = true;
      responseData.data = dataDeleted;
      return resp.status(ResponseCode.OK).json(responseData);
    } catch (error) {
      return handleError(
        resp,
        ResponseCode.INTERNAL_SERVER_ERROR,
        error,
        this.nameSpace
      );
    }
  };

  private highlightWordList = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const wordlistId = Number(req.params.wordlist_id);

      if (!wordlistId) {
        return this.handleError(
          resp,
          responseData,
          [`invalid wordlist Id`],
          ResponseCode.BAD_REQUEST
        );
      }

      const wordList = await this.vocabularySev.getWordListbyId(wordlistId);

      if (!wordList) {
        return this.handleError(
          resp,
          responseData,
          [`wordlist is exist`],
          ResponseCode.BAD_REQUEST
        );
      }

      const idWordlistHighlight = await this.vocabularySev.highlightWordList(
        wordList.id
      );
      if (!idWordlistHighlight) {
        return this.handleError(
          resp,
          responseData,
          [`INTERNAL SERVER ERROR`],
          ResponseCode.INTERNAL_SERVER_ERROR
        );
      }

      const wordListHighlight = await this.vocabularySev.getWordListbyId(
        idWordlistHighlight
      );
      responseData.success = true;
      responseData.data = wordListHighlight;
      return resp.status(ResponseCode.OK).json(responseData);
    } catch (error) {
      return handleError(
        resp,
        ResponseCode.INTERNAL_SERVER_ERROR,
        error,
        this.nameSpace
      );
    }
  };

  private updateVocabulary = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const vocabularyId = Number(req.params.vocabularyId);
      const user = req.body.userData;

      const body: T_VocabularyContent = {
        vocabulary: req.body.vocabulary
          ? doubleQuotationMark(req.body.vocabulary.trim())
          : "",
        vocabularyTranslate: req.body.vocabularyTranslate
          ? doubleQuotationMark(req.body.vocabularyTranslate.trim())
          : "",
        dictionaryEntry: req.body.dictionaryEntry
          ? doubleQuotationMark(req.body.dictionaryEntry.trim())
          : "",
        dictionaryEntryTranslate: req.body.dictionaryEntryTranslate
          ? doubleQuotationMark(req.body.dictionaryEntryTranslate.trim())
          : "",
        exampleSentences: req.body.exampleSentences
          ? doubleQuotationMark(req.body.exampleSentences.trim())
          : "",
        exampleSentencesTranslate: req.body.exampleSentencesTranslate
          ? doubleQuotationMark(req.body.exampleSentencesTranslate.trim())
          : "",
      };

      if (!vocabularyId) {
        return this.handleError(
          resp,
          responseData,
          [`invalid vocabulary Id`],
          ResponseCode.BAD_REQUEST
        );
      }

      const isExistVoca = await this.vocabularySev.checkVocabularyIsExistById(
        vocabularyId
      );

      if (!isExistVoca) {
        return this.handleError(
          resp,
          responseData,
          [`wordlist is exist`],
          ResponseCode.BAD_REQUEST
        );
      }

      const vocabularyUpdated = await this.vocabularySev.updateVocabularyById(
        vocabularyId,
        body
      );

      if (!vocabularyUpdated) {
        return this.handleError(
          resp,
          responseData,
          [`updateing faild`],
          ResponseCode.BAD_REQUEST
        );
      }

      this.cacheServ.refreshVocabularyCache();

      responseData.success = true;
      responseData.data = vocabularyUpdated;
      return resp.status(ResponseCode.OK).json(responseData);
    } catch (error) {
      return handleError(
        resp,
        ResponseCode.INTERNAL_SERVER_ERROR,
        error,
        this.nameSpace
      );
    }
  };

  private newVocabulary = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const user: User = req.body.userData;
      const unit = Number(req.params.unit);
      const body: T_VocabularyContent = {
        vocabulary: req.body.vocabulary
          ? doubleQuotationMark(req.body.vocabulary.trim())
          : "",
        vocabularyTranslate: req.body.vocabularyTranslate
          ? doubleQuotationMark(req.body.vocabularyTranslate.trim())
          : "",
        dictionaryEntry: req.body.dictionaryEntry
          ? doubleQuotationMark(req.body.dictionaryEntry.trim())
          : "",
        dictionaryEntryTranslate: req.body.dictionaryEntryTranslate
          ? doubleQuotationMark(req.body.dictionaryEntryTranslate.trim())
          : "",
        exampleSentences: req.body.exampleSentences
          ? doubleQuotationMark(req.body.exampleSentences.trim())
          : "",
        exampleSentencesTranslate: req.body.exampleSentencesTranslate
          ? doubleQuotationMark(req.body.exampleSentencesTranslate.trim())
          : "",
      };

      let isVaildInput = false;

      for (const elem of Object.values(body)) {
        if (elem) {
          isVaildInput = true;
          break;
        }
      }

      if (!isVaildInput) {
        return this.handleError(
          resp,
          responseData,
          [`invalid input`],
          ResponseCode.BAD_REQUEST
        );
      }

      const vocabularyId = await this.vocabularySev.newVocabulary(
        unit,
        user.id,
        body
      );

      if (!vocabularyId) {
        return this.handleError(
          resp,
          responseData,
          [`can't not create vocabulary`],
          ResponseCode.BAD_REQUEST
        );
      }

      this.cacheServ.refreshVocabularyCache();

      responseData.success = true;
      responseData.data = {
        id: vocabularyId,
        unit,
        ...body,
      };
      return resp.status(ResponseCode.OK).json(responseData);
    } catch (error) {
      return handleError(
        resp,
        ResponseCode.INTERNAL_SERVER_ERROR,
        error,
        this.nameSpace
      );
    }
  };
}

export default VocabularyRouter;
