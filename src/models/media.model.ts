import { getFullMediaUrl } from "../helpers/assestsURL";
import { BaseCache, CacheModel } from "./cache";

export class MediaModel {
  id: number = 0;
  created: number = 0;
  modified: number = 0;
  url: string = "";
  targetId: number = 0;
  targetType: number = 0;
  author: number = 0;
  orther: string = "";

  constructor(data?: any) {
    if (data) {
      this.id = data?.id;
      this.created = data?.created;
      this.modified = data?.modified;
      this.url = getFullMediaUrl(data?.url);
      this.targetId = data?.target_id;
      this.targetType = data?.target_type;
      this.author = data?.author;
      this.orther = data?.orther;
    }
  }
}

// tslint:disable-next-line: max-classes-per-file
export class MediaCache extends BaseCache<MediaModel> {
  constructor(_data: MediaModel[] = []) {
    super();
    this.data = _data.map((item) => new CacheModel(item.id, item));
  }
}
