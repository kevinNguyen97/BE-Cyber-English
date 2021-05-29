import { getFullMediaUrl } from "../helpers/assestsURL";
import { stringOrNull } from "../interfaces/types";
import { BaseCache, CacheModel } from "./cache";
export class VocabularyModel {
  id: number = 0;
  created: number = 0;
  modified: number = 0;
  vocabulary: string = "";
  translate: string = "";
  spelling: string = '';
  dictionaryEntry: string = "";
  audioDictionaryUS: stringOrNull = "";
  audioDictionaryUK: stringOrNull = "";
  dictionaryEntryTranslate: string = "";
  exampleSentences: string = "";
  exampleSentencesTranslate: string = "";
  audioExampleSentencesUS: stringOrNull = "";
  audioExampleSentencesUK: stringOrNull = "";
  author: number | undefined | null = null;
  orther: string = "";
  unit: number = 0;
  oldId: number = 0;
  isDeleted: boolean = false;

  constructor(data: any = null) {
    if (data) {
      const {
        id,
        created,
        modified,
        vocabulary,
        translate,
        spelling,
        dictionary_entry,
        dictionary_entry_translate,
        example_sentences,
        example_sentences_translate,
        author,
        orther,
        unit,
        old_id,
        audio_dictionary_US,
        audio_dictionary_UK,
        audio_example_Sentences_US,
        audio_example_Sentences_UK,
        is_deleted,
      } = data;
      this.id = id;
      this.created = created;
      this.modified = modified;
      this.vocabulary = vocabulary;
      this.translate = translate;
      this.spelling = spelling;
      this.dictionaryEntry = dictionary_entry;
      this.dictionaryEntryTranslate = dictionary_entry_translate;
      this.exampleSentences = example_sentences;
      this.exampleSentencesTranslate = example_sentences_translate;
      this.author = author;
      this.orther = orther;
      this.unit = unit;
      this.oldId = old_id;
      this.audioDictionaryUS = getFullMediaUrl(audio_dictionary_US);
      this.audioDictionaryUK = getFullMediaUrl(audio_dictionary_UK);
      this.audioExampleSentencesUS = getFullMediaUrl(
        audio_example_Sentences_US
      );
      this.audioExampleSentencesUK = getFullMediaUrl(
        audio_example_Sentences_UK
      );
      this.isDeleted = !!is_deleted;
    }
  }
}

// tslint:disable-next-line: max-classes-per-file
export class UserWorkList {
  id: number = 0;
  created: number = 0;
  modified: number = 0;
  vocabularyId: number = 0;
  userId: number = 0;
  isHighlight: boolean = false;
  isDeleted: boolean = false;
  orther: any = null;
  constructor(data: any) {
    if (data) {
      this.id = data.id;
      this.created = data.created;
      this.modified = data.modified;
      this.vocabularyId = data.vocabulary_id;
      this.userId = data.user_id;
      this.isHighlight = !!data.is_highlight;
      this.isDeleted = !!data.is_deleted;
      this.orther = data.orther;
    }
  }
}

// tslint:disable-next-line: max-classes-per-file
export class VocabularyCache extends BaseCache<VocabularyModel> {
  private unitData: any = {};
  constructor(_data: VocabularyModel[] = []) {
    super();
    this.data = _data.map((item) => new CacheModel(item.id, item));
    _data.forEach((item) => {
      const isExistUnit = !!Object.keys(this.unitData).find(
        (ele) => Number(ele) === item.unit
      );
      if (isExistUnit) {
        this.unitData[item.unit].push(item);
      } else {
        this.unitData[item.unit] = [item];
      }
    });
  }

  getVocabularyByUnit(unit: number): VocabularyModel[] {
    return this.unitData[unit]
      ? this.unitData[unit].filter((ele) => ele.isDeleted === false)
      : [];
  }
}

export type T_VocabularyContent = {
  vocabulary: string;
  vocabularyTranslate: string;
  dictionaryEntry: string;
  dictionaryEntryTranslate: string;
  exampleSentences: string;
  exampleSentencesTranslate: string;
};
