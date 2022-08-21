import { SprintState } from './types';

export const sprintState: SprintState = {
  earnedPoints: 0,
  rewordPoints: 10,
  rightAnswers: [],
  wrongAnswers: [],
  words: [],
  randomWords: {
    word: {
      id: '',
      group: 0,
      page: 0,
      word: '',
      image: '',
      audio: '',
      audioMeaning: '',
      audioExample: '',
      textMeaning: '',
      textExample: '',
      transcription: '',
      wordTranslate: '',
      textMeaningTranslate: '',
      textExampleTranslate: '',
    },
    random: {
      id: '',
      group: 0,
      page: 0,
      word: '',
      image: '',
      audio: '',
      audioMeaning: '',
      audioExample: '',
      textMeaning: '',
      textExample: '',
      transcription: '',
      wordTranslate: '',
      textMeaningTranslate: '',
      textExampleTranslate: '',
    },
  },
  seconds: 60,
};

export const unableSprintState = () => {
  sprintState.rightAnswers = [];
  sprintState.wrongAnswers = [];
  sprintState.earnedPoints = 0;
  sprintState.rewordPoints = 10;
  sprintState.seconds = 60;
};
