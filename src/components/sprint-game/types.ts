import { ResponseUserWord, Word } from 'types/index';

export type CurrentWord = {
  curWordIdx: number;
  randomIdx: number;
};

export type Session = {
  count: number;
  longestRow: number;
};

export type SprintState = {
  earnedPoints: number;
  rewordPoints: number;
  rightAnswers: number[];
  wrongAnswers: number[];
  words: Word[];
  userWords: ResponseUserWord[];
  wordsIndexes: number[];
  randomWords: CurrentWord;
  timer: number;
  session: Session;
};

export type DeleteWord = (wordsIdx: number[], shownWordIdx: number) => number[];

export enum Points {
  Small = 10,
  Medium = 20,
  High = 40,
}
