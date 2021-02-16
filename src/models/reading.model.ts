import { numberOrNull, stringOrNull } from "../interfaces/types";
import { MediaModel } from "./media.model";
import { UnitsModel } from "./Units.model";

export class ParagraphModel {
  id: numberOrNull = null;
  created: numberOrNull = null;
  modified: numberOrNull = null;
  author: numberOrNull = null;
  paragraphs: stringOrNull = null;
  translate: stringOrNull = null;
  fullHtmlTag: stringOrNull = null;
  isChildren: boolean = false;
  orther: stringOrNull = null;
  unit: numberOrNull = null;

  constructor(data: any) {
    if (data) {
      this.id = data?.id;
      this.created = data?.created;
      this.modified = data?.modified;
      this.author = data?.author;
      this.paragraphs = data?.paragraphs;
      this.translate = data?.translate;
      this.fullHtmlTag = data?.full_html_tag;
      this.isChildren = !!data?.is_children;
      this.orther = data?.orther;
      this.unit = data?.unit;
    }
  }
}

// tslint:disable-next-line: max-classes-per-file
export class ParagraphResponseModel {
  paragraphs: stringOrNull = null;
  translate: stringOrNull = null;
  fullHtmlTag: stringOrNull = null;
  isChildren: boolean = false;

  constructor(data: ParagraphModel) {
    if (data) {
      this.paragraphs = data?.paragraphs;
      this.translate = data?.translate;
      this.fullHtmlTag = data?.fullHtmlTag;
      this.isChildren = !!data?.isChildren;
    }
  }
}

// tslint:disable-next-line: max-classes-per-file
export class ReadingComprehensionQuestions {
  id: numberOrNull = null;
  created: numberOrNull = null;
  modified: numberOrNull = null;
  author: numberOrNull = null;
  question: stringOrNull = null;
  isExact: boolean = false;
}

// tslint:disable-next-line: max-classes-per-file
export class ReadingResponseModel {
  id: numberOrNull = null;
  unit: numberOrNull = null;
  unitTitle: stringOrNull = null;
  unitTitleTranslate: stringOrNull = null;
  audioUrl: stringOrNull | undefined = null;
  listParagraphs: ParagraphResponseModel[] = [];
  discussionQuestions: string[] = [];
  readingComprehensionQuestions: ReadingComprehensionQuestions[] = [];
  constructor(
    unit: UnitsModel,
    media: MediaModel | undefined,
    paragraphs: ParagraphModel[]
  ) {
    this.id = unit.id;
    this.unit = unit.unit;
    this.unitTitle = unit.title;
    this.unitTitleTranslate = unit.translate;
    this.audioUrl = media?.url;
    this.listParagraphs = paragraphs.map(
      (item) => new ParagraphResponseModel(item)
    );
    this.discussionQuestions = [];
    this.readingComprehensionQuestions = [];
  }
}
