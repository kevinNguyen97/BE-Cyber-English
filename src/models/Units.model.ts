import { numberOrNull, stringOrNull } from "../interfaces/types";

export class UnitsModel {
  id: numberOrNull = null;
  created: numberOrNull = null;
  modified: numberOrNull = null;
  author: numberOrNull = null;
  unit: numberOrNull = null;
  title: stringOrNull = null;s
  translate: stringOrNull = null;
  orther: stringOrNull = null;
  oldId: numberOrNull = null;
  constructor(data?: any) {
    if (data) {
      this.id = data?.id;
      this.created = data?.created;
      this.modified = data?.modified;
      this.author = data?.author;
      this.unit = data?.unit;
      this.title = data?.title;
      this.translate = data?.translate;
      this.orther = data?.orther;
      this.oldId = data?.old_id;
    }
  }
}
