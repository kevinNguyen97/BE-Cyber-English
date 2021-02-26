import { getFullMediaUrl } from "../helpers/mediaUrl";
import { numberOrNull, stringOrNull } from "../interfaces/types";
export class VocabularyModel {
  id: numberOrNull = null;
  created: numberOrNull = null;
  modified: numberOrNull = null;
  vocabulary: stringOrNull = null;
  translate: stringOrNull = null;
  dictionaryEntry: stringOrNull = null;
  audioDictionaryUS: stringOrNull = null;
  audioDictionaryUK: stringOrNull = null;
  dictionaryEntryTranslate: stringOrNull = null;
  exampleSentences: stringOrNull = null;
  exampleSentencesTranslate: stringOrNull = null;
  audioExampleSentencesUS: stringOrNull = null;
  audioExampleSentencesUK: stringOrNull = null;
  author: number | undefined | null = null;
  orther: stringOrNull = null;
  unit: numberOrNull = null;
  oldId: numberOrNull = null;

  constructor(data: any = null) {
    if (data) {
      const {
        id,
        created,
        modified,
        vocabulary,
        translate,
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
      } = data;
      this.id = id;
      this.created = created;
      this.modified = modified;
      this.vocabulary = vocabulary;
      this.translate = translate;
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
    }
  }
}

// tslint:disable-next-line: max-classes-per-file
export class UserWorkList {
  id: number = 0;
  created: numberOrNull = null;
  modified: numberOrNull = null;
  vocabularyId: numberOrNull = null;
  userId: numberOrNull = null;
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
