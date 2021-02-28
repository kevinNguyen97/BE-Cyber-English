import { numberOrNull, stringOrNull } from "../interfaces/types";
import { getRandomInt } from "../ultils/Ultil";
import { VocabularyModel } from "./vocabulary";

export class MultipleChoiceHaveDone {
  id: number = 0;
  userId: number = 0;
  unitId: number = 0;
  vocabularyId: number = 0;
  constructor(data: any) {
    if (data) {
      this.id = data.id;
      this.userId = data.user_id;
      this.unitId = data.unit_id;
      this.vocabularyId = data.vocabulary_id;
    }
  }
}

// tslint:disable-next-line: max-classes-per-file
export class MultipleChoiceQuestion {
  id: numberOrNull = null;
  vocabulary: stringOrNull = null;
  answerList: stringOrNull[] = [];
  constructor(exact: VocabularyModel, subQuestion: VocabularyModel[]) {
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
  }
}

// tslint:disable-next-line: max-classes-per-file
export class MultipleChoiceResponseChecked {
  unit: number = 0;
  vocabulary: string = "";
  answer: string = "";
  isExact: boolean = false;
  answered: number = 0;
  total: number | null = 0;
  constructor(
    _vocabulary: string,
    _answer: string,
    _isExact: boolean = false,
    _unit: number,
    _answered: number,
    _total: number
  ) {
    this.vocabulary = _vocabulary;
    this.answer = _answer;
    this.isExact = _isExact;
    this.unit = _unit;
    this.answered = _answered;
    this.total = _total;
  }
}
