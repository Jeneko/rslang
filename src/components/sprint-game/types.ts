import { Word } from 'types/index';

export type CurrentWord = {
  word: Word;
  random: Word;
};

export type SprintState = {
  earnedPoints: number;
  rewordPoints: number;
  rightAnswers: Word[];
  wrongAnswers: Word[];
  words: Word[];
  randomWords: CurrentWord;
  seconds: number;
};
