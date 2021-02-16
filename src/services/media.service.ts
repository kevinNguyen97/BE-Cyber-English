import "reflect-metadata";
import mysql from "mysql";
import DBService from "../config/mysql";
import { singleton } from "tsyringe";
import LoggerService from "../config/logger";
import { MediaModel } from "../models/media.model";
import { mediaTargetType } from "../constants/targetType.media";
import UnitService from "./unit.service";

@singleton()
class MediaService {
  private nameSpace = "MediaService";
  private connection: mysql.Pool;
  private listMedia: MediaModel[] = [];

  constructor(
    private dBService: DBService,
    private logger: LoggerService,
    private unitSev: UnitService
  ) {
    this.log('')
    this.connection = this.dBService.getConnection();
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

  getAllMedia = (): Promise<MediaModel[]> => {
    return new Promise((resolve, reject) => {
      if (this.listMedia && this.listMedia.length) {
        resolve(this.listMedia);
      } else {
        this.connection.query(`SELECT * FROM media;`, (err, result) => {
          this.handleGetAllResult(
            err,
            result,
            resolve,
            reject,
            (item: any) => new MediaModel(item)
          );
        });
      }
    });
  };

  getMediaReadingByUnit = (unit: number): Promise<MediaModel | undefined> => {
    return new Promise(async (resolve, reject) => {
      const allUnit = await this.getAllMedia();
      const unitDetail = await this.unitSev.getUnitDetail(unit);
      if (!allUnit || !unitDetail) {
        reject(null);
        return;
      }
      const media = allUnit.find(
        (item) =>
          item.targetId === unitDetail.id &&
          item.targetType === mediaTargetType.unit
      );
      resolve(media);
    });
  };
}

export default MediaService;
