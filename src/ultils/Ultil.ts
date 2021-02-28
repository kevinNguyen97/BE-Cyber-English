import { irregular, plural, regex, singular, uncountable } from "../constants";

export const getRandomFloat = (max: number, min: number = 0): number =>
  Math.random() * (max - min) + min;

export const getRandomInt = (max: number, min: number = 0): number => {
  const _min = Math.ceil(min);
  const _max = Math.floor(max);
  return Math.floor(Math.random() * (_max - _min) + _min);
};

export const removeParenthesesBrackets = (str: string): string => {
  return str.replace(regex.bracketParentheses, "").trim();
};

export const toSingular = (_str: string): string => {
  const str = _str;
  if (uncountable.indexOf(str.toLowerCase()) >= 0) return str;

  for (const word of Object.keys(irregular)) {
    const pattern = new RegExp(irregular[word] + "$", "i");
    const replace = word;
    if (pattern.test(str)) return str.replace(pattern, replace);
  }

  for (const reg of Object.keys(singular)) {
    const pattern = new RegExp(reg, "i");

    if (pattern.test(str)) return str.replace(pattern, singular[reg]);
  }

  return str;
};

export const toPlural = (_str: string): string => {
  const str = _str;

  if (uncountable.indexOf(str.toLowerCase()) >= 0) return str;
  for (const item of Object.keys(irregular)) {
    const pattern = new RegExp(item + "$", "i");
    const replace = irregular[item];

    if (pattern.test(str)) return str.replace(pattern, replace);
  }

  for (const reg of Object.keys(plural)) {
    const pattern = new RegExp(reg, "i");

    if (pattern.test(str)) return str.replace(pattern, plural[reg]);
  }

  return str;
};

