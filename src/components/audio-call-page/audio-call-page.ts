import './audio-call-page.css';
import { getChoiceOfDifficultyLevel } from '../audio-call-game/menuDifficultyLevel/getChoiceOfDifficultyLevel/startNewGame/game';

export default async function getAudioCallPage(): Promise<HTMLElement> {
  const elem = getChoiceOfDifficultyLevel();
  elem.className = 'audio-call-page';
  return elem;
}
