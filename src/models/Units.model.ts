import { numberOrNull, stringOrNull } from "../interfaces/types";

export class UnitsModel {
  id: number = 0;
  created: number = 0;
  modified: number = 0;
  author: number = 0;
  unit: number = 0;
  title: stringOrNull = null;
  translate: stringOrNull = null;
  orther: stringOrNull = null;
  oldId: number = 0;
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

// tslint:disable-next-line: max-classes-per-file
export class UnitsResponse {
  id: number = 0;
  created: number = 0;
  modified: number = 0;
  author: number = 0;
  unit: number = 0;
  title: stringOrNull = null;
  translate: stringOrNull = null;
  orther: stringOrNull = null;
  isLock: boolean = true;
  constructor(unit: UnitsModel, _isLock: boolean = true) {
    this.id = unit.id;
    this.created = unit.created;
    this.modified = unit.modified;
    this.author = unit.author;
    this.unit = unit.unit;
    this.title = unit.title;
    this.translate = unit.translate;
    this.orther = unit.orther;
    this.isLock = _isLock;
  }
}
