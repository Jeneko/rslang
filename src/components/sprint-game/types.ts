import { Word } from 'types/index';

export type CurrentWord = {
  word: Word;
  random: Word;
};

export type Answers = {
  rightAnswers: Word[];
  wrongAnswers: Word[];
};
