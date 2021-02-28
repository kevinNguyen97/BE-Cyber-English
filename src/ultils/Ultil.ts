import { regex } from "../constants";

export const getRandomFloat = (max: number, min: number = 0): number =>
  Math.random() * (max - min) + min;

export const getRandomInt = (max: number, min: number = 0): number => {
  const _min = Math.ceil(min);
  const _max = Math.floor(max);
  return Math.floor(Math.random() * (_max - _min) + _min);
};

export const removeParenthesesBrackets = (str: string): string => {
  return str.replace(/\((.*?)\)/, "").trim();
};
