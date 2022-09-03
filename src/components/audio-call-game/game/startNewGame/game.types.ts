import { Word } from 'types/index';

export type GameState = {
  correctAnswers: Word[];
  wrongAnswers: Word[];
  currentLevel: number;
  counterStreakForGame: number;
  longestStreakForGame: number;
  newWords: number;
}
