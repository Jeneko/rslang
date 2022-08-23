import { SprintState } from './types';

export const sprintState: SprintState = {
  earnedPoints: 0,
  rewordPoints: 10,
  rightAnswers: [],
  wrongAnswers: [],
  words: [],
  wordsIndexes: [],
  randomWords: {
    word: 0,
    random: 0,
  },
  timer: 60,
};

export const setDefaultSprintState = () => {
  sprintState.rightAnswers = [];
  sprintState.wrongAnswers = [];
  sprintState.earnedPoints = 0;
  sprintState.rewordPoints = 10;
  sprintState.timer = 60;
};
