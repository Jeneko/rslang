import { SprintState } from './types';

export const sprintState: SprintState = {
  earnedPoints: 0,
  rewordPoints: 10,
  rightAnswers: [],
  wrongAnswers: [],
  words: [],
  userWords: [],
  wordsIndexes: [],
  randomWords: {
    curWordIdx: 0,
    randomIdx: 0,
  },
  timer: 60,
  session: {
    count: 0,
    session: 0,
  },
};

export const setDefaultSprintState = () => {
  sprintState.rightAnswers = [];
  sprintState.wrongAnswers = [];
  sprintState.earnedPoints = 0;
  sprintState.rewordPoints = 10;
  sprintState.timer = 60;
  sprintState.session.count = 0;
  sprintState.session.session = 0;
};
