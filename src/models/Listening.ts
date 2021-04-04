import { numberOrNull, stringOrNull } from "../interfaces/types";
import { VocabularyModel } from "./vocabulary";
import { MultipleChoiceHaveDone, ProcessingData } from "./MultipleChoice";
import { getRandomInt, removeParenthesesBrackets, stringToBase64 } from "../ultils/Ultil";
import { regex } from "../constants";

class Suggestions {
  character: string = "";
  index: number = -1;
  length: number = 0;
  constructor(_character: string, _index: number, _length: number) {
    this.character = _character;
    this.index = _index;
    this.length = _length;
  }
}

// tslint:disable-next-line: max-classes-per-file
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
  code: string
  // suggestions: Suggestions = {
  //   character: "",
  //   index: 0,
  //   length: 0,
  // };
  processing: ProcessingData;
  constructor(exact: VocabularyModel, _process: ProcessingData) {
    this.id = exact.id;
    this.audioUkUrl = exact.audioDictionaryUK;
    this.audioUsUrl = exact.audioDictionaryUS;
    this.code =  stringToBase64(exact.vocabulary)
    // const getRandomCharacters = (
    //   _vocabulary: string = exact.vocabulary
    // ): Suggestions => {
    //   const vocabulary = removeParenthesesBrackets(_vocabulary);
    //   let indexRandom = 0;
    //   let character: string;
    //   do {
    //     indexRandom = getRandomInt(vocabulary.length);
    //     character = vocabulary.charAt(indexRandom).trim();
    //   } while (!character);
    //   return new Suggestions(character, indexRandom, vocabulary.length);
    // };

    // this.suggestions = getRandomCharacters();
    this.processing = _process;
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
  processing: ProcessingData;
  code: string;

  constructor(
    _id: number,
    _unit: number,
    _audioUkUrl: any,
    _audioUsUrl: any,
    _answer: string,
    _isExact: boolean,
    _process: ProcessingData,
    _vocabulary: string | undefined
  ) {
    this.id = _id;
    this.unit = _unit;
    this.audioUkUrl = _audioUkUrl;
    this.audioUsUrl = _audioUsUrl;
    this.answer = _answer;
    this.isExact = _isExact;
    this.processing = _process;
    this.code = _vocabulary ? stringToBase64(_vocabulary) : "";
  }
}
