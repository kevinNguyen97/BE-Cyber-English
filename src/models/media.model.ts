import { numberOrNull, stringOrNull } from "../interfaces/types";

export class MediaModel {
  id: numberOrNull = null;
  created: numberOrNull = null;
  modified: numberOrNull = null;
  url: stringOrNull = null;
  targetId: numberOrNull = null;
  targetType: numberOrNull = null;
  author: numberOrNull = null;
  orther: stringOrNull = null;

  constructor(data?: any) {
    if (data) {
      this.id = data?.id;
      this.created = data?.created;
      this.modified = data?.modified;
      this.url = data?.url;
      this.targetId = data?.target_id;
      this.targetType = data?.target_type;
      this.author = data?.author;
      this.orther = data?.orther;
    }
  }
}
