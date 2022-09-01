import { GameStatistic, WordsStatistic } from 'types/index';

export type ObjectStatisticsType = {
  allStatAudiocall: GameStatistic[];
  allStatSprint: GameStatistic[];
  allStatWords:  WordsStatistic[];

  lengthAudiocall: number;
  lengthSprint: number;
  lengthWords: number;

  wordsLearned: number;
  wordsNew: number;
  wordsRightAnswers: number;

  audiocallRightAnswers: number;
  audiocallLongestRow: number;
  audiocallNewWords: number;
  audiocallWrongAnswers: number;
  audiocallPercentRightAnswers: number;

  sprintRightAnswers: number;
  sprintLongestRow: number;
  sprintNewWords: number;
  sprintWrongAnswers: number;
  sprintPercentRightAnswers: number;
}
