import "reflect-metadata";
import mysql from "mysql";
import DBService from "../config/mysql";
import { singleton } from "tsyringe";
import LoggerService from "../config/logger";
import { MediaModel } from "../models/media.model";
import { mediaTargetType } from "../constants/targetType.media";
import UnitService from "./unit.service";
import BaseService from "./base.service";
import CacheService from "./cache.service";

@singleton()
class MediaService extends BaseService {
  constructor(private unitSev: UnitService, private cacheServ: CacheService) {
    super();
    this.nameSpace = "MediaService";
  }

  getMediaReadingByUnit = (unit: number): Promise<MediaModel | undefined> => {
    return new Promise(async (resolve, reject) => {
      const allMedia = this.cacheServ.media.allData;
      const unitDetail = await this.unitSev.getUnitDetail(unit);
      if (!allMedia || !unitDetail) {
        reject(null);
        return;
      }
      const media = allMedia.find(
        (item) =>
          item.targetId === unitDetail.id &&
          item.targetType === mediaTargetType.unit
      );
      resolve(media);
    });
  };
}

export default MediaService;
