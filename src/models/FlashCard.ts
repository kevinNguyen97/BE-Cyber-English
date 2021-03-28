import { VocabularyModel } from "./vocabulary";

export class FlashCard {
  id: number = 0;
  created: number = 0;
  modified: number = 0;
  userId: number = 0;
  vocabularyId: number = 0;
  remindDay: number = 0;
  orther?: string;
  constructor(data: any) {
    if (data) {
      this.id = data.id;
      this.created = data.created;
      this.modified = data.modified;
      this.userId = data.user_id;
      this.vocabularyId = data.vocabulary_id;
      this.remindDay = data.remind_day;
      this.orther = data.orther;
    }
  }
}

// tslint:disable-next-line: max-classes-per-file
export class FlashCardData {
  id: number = 0;
  created: number = 0;
  modified: number = 0;
  userId: number = 0;
  remindDay: number = 0;
  vocabularyData?: VocabularyModel;
  orther?: string;
  constructor(data: FlashCard, _vocabulary?: VocabularyModel) {
    if (data) {
      this.id = data.id;
      this.created = data.created;
      this.modified = data.modified;
      this.userId = data.userId;
      this.remindDay = data.remindDay;
      this.orther = data.orther;
    }
    if (_vocabulary) {
      this.vocabularyData = _vocabulary;
    }
  }
}
