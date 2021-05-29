import "reflect-metadata";
import { singleton } from "tsyringe";
import BaseService from "./base.service";
import { VocabularyCache, VocabularyModel } from "../models/vocabulary";
import { MediaCache, MediaModel } from "../models/media.model";
import { Role, RoleCache } from "../models/role.model";

@singleton()
class CacheService extends BaseService {
  media: MediaCache = new MediaCache();
  vocabulary: VocabularyCache = new VocabularyCache();
  role: RoleCache = new RoleCache();
  constructor() {
    super();
    this.nameSpace = "CacheService";
    this.init();
  }
  init = async () => {
    this.getMediaCache();
    this.getVocabularyCache();
    this.getRoleCache();
  };

  getMediaCache = async () => {
    try {
      this.log("", "start cache getAllMedia");
      const data = await this.getAllMedia();
      this.media = new MediaCache(data);
      this.log("", "finish cache MediaCache");
    } catch (error) {
      this.logErr(error);
    }
  };

  getVocabularyCache = async () => {
    try {
      this.log("", "start cache getAllVocabularies");
      const data = await this.getAllVocabularies();
      this.vocabulary = new VocabularyCache(data);
      this.log("", "finish cache VocabularyCache");
    } catch (error) {
      this.logErr(error);
    }
  };

  refreshVocabularyCache = async () => {
    try {
      this.log("", "start refresh cache getAllVocabularies");
      const data = await this.getAllVocabularies();
      this.vocabulary = new VocabularyCache(data);
      this.log("", "finish refresh cache VocabularyCache");
    } catch (error) {
      this.logErr(error);
    }
  };

  getRoleCache = async () => {
    try {
      this.log("", "start cache getAllRole");
      const data = await this.getAllRole();
      this.role = new RoleCache(data);
      this.log("", "finish cache RoleCache");
    } catch (error) {
      this.logErr(error);
    }
  };

  private getAllMedia = (): Promise<MediaModel[]> => {
    return new Promise((resolve, reject) => {
      this.connection.query(`SELECT * FROM media;`, (err, result) => {
        if (err) {
          this.log(err, "");
          reject(err);
        }
        let data: MediaModel[] = [];
        if (result && result?.length) {
          data = result.map((item: any) => new MediaModel(item));
        }
        resolve(data);
      });
    });
  };

  private getAllVocabularies = (): Promise<VocabularyModel[]> => {
    return new Promise((resolve, reject) => {
      this.connection.query(`SELECT * FROM vocabularies;`, (err, result) => {
        if (err) {
          this.log(err, "");
          return reject(err);
        }
        let data: VocabularyModel[] = [];
        if (result && result?.length) {
          data = result.map((item: any) => new VocabularyModel(item));
        }
        resolve(data);
      });
    });
  };

  private getAllRole = (): Promise<Role[]> => {
    return new Promise((resolve, reject) => {
      this.connection.query(`SELECT * FROM role`, (err, result) => {
        if (err) return reject(err);
        let data: Role[] = [];
        if (result && result.length > 0) {
          data = result.map((item: any) => new Role(item));
        }
        return resolve(data);
      });
    });
  };
}

export default CacheService;
