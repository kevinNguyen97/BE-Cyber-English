import { numberOrNull, stringOrNull, TProcessing } from "../interfaces/types";
import { getRandomInt } from "../ultils/Ultil";
import { VocabularyModel } from "./vocabulary";

export class MultipleChoiceHaveDone {
  id: number = 0;
  userId: number = 0;
  unitId: number = 0;
  vocabularyId: number = 0;
  countReplies: number = 0;
  isDone: boolean = false;
  constructor(data: any) {
    if (data) {
      this.id = data.id;
      this.userId = data.user_id;
      this.unitId = data.unit_id;
      this.vocabularyId = data.vocabulary_id;
      this.countReplies = data.count_replies;
      this.isDone = !!data.is_done;
    }
  }
}

// tslint:disable-next-line: max-classes-per-file
export class MultipleChoiceQuestion {
  id: numberOrNull = null;
  vocabulary: stringOrNull = null;
  answerList: stringOrNull[] = [];
  processing: TProcessing;
  constructor(
    exact: VocabularyModel,
    subQuestion: VocabularyModel[],
    _process: TProcessing
  ) {
    this.id = exact.id;
    this.vocabulary = exact.vocabulary;
    const indexRandom = getRandomInt(3);

    subQuestion.forEach((item, index) => {
      if (index === indexRandom) {
        this.answerList.push(exact.dictionaryEntry);
      }
      this.answerList.push(item.dictionaryEntry);
    });
    if (this.answerList.length < 3) {
      this.answerList.push(exact.dictionaryEntry);
    }
    this.processing = _process;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class MultipleChoiceResponseChecked {
  unit: number = 0;
  vocabulary: string = "";
  answer: string = "";
  isExact: boolean = false;
  processing: TProcessing;

  constructor(
    _vocabulary: string,
    _answer: string,
    _isExact: boolean = false,
    _unit: number,
    _process: TProcessing
  ) {
    this.vocabulary = _vocabulary;
    this.answer = _answer;
    this.isExact = _isExact;
    this.unit = _unit;
    this.processing = _process;
  }
}
