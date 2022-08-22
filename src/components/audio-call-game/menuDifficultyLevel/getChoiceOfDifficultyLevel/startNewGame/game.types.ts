import { Word } from '../../../../../types/index';

export type GameState = {
  correctAnswers: Word[];
  wrongAnswers: Word[];
  currentLevel: string;
}
