import { ResponseUserWord, Word } from 'types/index';

export type CurrentWord = {
  curWordIdx: number;
  randomIdx: number;
};

export type Session = {
  count: number;
  session: number;
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

export type DeleteWord = (wordsInd: number[], shownWord: number) => number[];

export enum Points {
  small = 10,
  medium = 20,
  high = 40,
}
