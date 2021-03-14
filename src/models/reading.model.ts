import { numberOrNull, stringOrNull } from "../interfaces/types";
import { stringToBase64 } from "../ultils/Ultil";
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

  getDataResponse = () => {
    return {
      paragraphs: this.paragraphs,
      translate: this.translate,
      fullHtmlTag: this.fullHtmlTag,
      isChildren: this.isChildren,
    };
  };
}

// tslint:disable-next-line: max-classes-per-file
export class ReadingDiscussionQuestions {
  id: numberOrNull = null;
  created: numberOrNull = null;
  modified: numberOrNull = null;
  author: numberOrNull = null;
  unit: numberOrNull = null;
  questtion: stringOrNull = null;
  translate: stringOrNull = null;
  orther: stringOrNull = null;

  constructor(data: any) {
    if (data) {
      this.id = data?.id;
      this.created = data?.created;
      this.modified = data?.modified;
      this.author = data?.author;
      this.unit = data?.unit;
      this.questtion = data?.questtion;
      this.translate = data?.translate;

      this.orther = data?.orther;
    }
  }

  getDataResponse = () => {
    return {
      id: this.id,
      questtion: this.questtion,
      translate: this.translate,
    };
  };
}

// tslint:disable-next-line: max-classes-per-file
export class ReadingComprehensionQuestions {
  id: numberOrNull = null;
  created: numberOrNull = null;
  modified: numberOrNull = null;
  author: numberOrNull = null;
  unit: numberOrNull = null;
  questtion: stringOrNull = null;
  translate: stringOrNull = null;
  orther: stringOrNull = null;
  isExact: boolean = false;

  constructor(data: any) {
    if (data) {
      this.id = data?.id;
      this.created = data?.created;
      this.modified = data?.modified;
      this.author = data?.author;
      this.unit = data?.unit;
      this.questtion = data?.questtion;
      this.translate = data?.translate;
      this.orther = data?.orther;
      this.isExact = !!data?.is_exact;
    }
  }

  getDataResponse = () => {
    return {
      id: this.id,
      questtion: this.questtion,
      translate: this.translate,
      code: stringToBase64(this.isExact.toString()),
    };
  };
}

// tslint:disable-next-line: max-classes-per-file

// tslint:disable-next-line: max-classes-per-file
export class ReadingResponseModel {
  id: numberOrNull = null;
  unit: numberOrNull = null;
  unitTitle: stringOrNull = null;
  unitTitleTranslate: stringOrNull = null;
  audioUrl: stringOrNull | undefined = null;
  listParagraphs: any[] = [];
  discussionQuestions: any[] = [];
  comprehensionQuestions: any[] = [];
  constructor(
    unit: UnitsModel,
    media: MediaModel | undefined,
    paragraphs: ParagraphModel[],
    discussionQuestions: ReadingDiscussionQuestions[] | null,
    comprehensionQuestions: ReadingComprehensionQuestions[] | null
  ) {
    this.id = unit.id;
    this.unit = unit.unit;
    this.unitTitle = unit.title;
    this.unitTitleTranslate = unit.translate;
    this.audioUrl = media?.url;
    this.listParagraphs = paragraphs.map((item) => item.getDataResponse());
    this.discussionQuestions = (discussionQuestions
      ? discussionQuestions
      : []
    ).map((item) => item.getDataResponse());
    this.comprehensionQuestions = (comprehensionQuestions
      ? comprehensionQuestions
      : []
    ).map((item) => item.getDataResponse());
  }
}
