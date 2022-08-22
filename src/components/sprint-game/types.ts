import { Word } from 'types/index';

export type CurrentWord = {
  word: number;
  random: number;
};

export type SprintState = {
  earnedPoints: number;
  rewordPoints: number;
  rightAnswers: number[];
  wrongAnswers: number[];
  words: Word[];
  wordsIndexes: number[];
  randomWords: CurrentWord;
  seconds: number;
};

export type DeleteWord = (wordsInd: number[], shownWord: number) => number[];
