import { numberOrNull, stringOrNull } from "../interfaces/types";
import { VocabularyModel } from "./vocabulary";
import { MultipleChoiceHaveDone } from "./MultipleChoice";
import { getRandomInt, removeParenthesesBrackets } from "../ultils/Ultil";
import { regex } from "../constants";

type TSuggestions = { character: string; index: number };

export class ListeningHaveDone extends MultipleChoiceHaveDone {
  constructor(data: any) {
    super(data);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class ListeningQuestionResponses {
  id: numberOrNull = null;
  audioUkUrl: stringOrNull = null;
  audioUsUrl: stringOrNull = null;
  suggestions: TSuggestions = {
    character: "",
    index: 0,
  };
  constructor(exact: VocabularyModel) {
    this.id = exact.id;
    this.audioUkUrl = exact.audioDictionaryUK;
    this.audioUsUrl = exact.audioDictionaryUK;
    const getRandomCharacters = (
      _vocabulary: string = exact.vocabulary
    ): TSuggestions => {
      const vocabulary = removeParenthesesBrackets(_vocabulary)
      let indexRandom = 0;
      let character: string;
      do {
        indexRandom = getRandomInt(vocabulary.length);
        character = vocabulary.charAt(indexRandom).trim();
      } while (!character);
      return {
        character,
        index: indexRandom,
      };
    };

    this.suggestions = getRandomCharacters();
  }
}

// tslint:disable-next-line: max-classes-per-file
export class ListeningResponseChecked {
  id: number = 0;
  unit: number = 0;
  audioUkUrl: stringOrNull = null;
  audioUsUrl: stringOrNull = null;
  answer: string = "";
  isExact: boolean = false;
  answered: number = 0;
  total: number | null = 0;
  constructor(
    _id: number,
    _unit: number,
    _audioUkUrl: any,
    _audioUsUrl: any,
    _answer: string,
    _isExact: boolean,
    _answered: number,
    _total: number,
  ) {
    this.id = _id
    this.unit = _unit
    this.audioUkUrl = _audioUkUrl
    this.audioUsUrl = _audioUsUrl
    this.answer = _answer
    this.isExact = _isExact
    this.answered = _answered
    this.total = _total
  }
}
