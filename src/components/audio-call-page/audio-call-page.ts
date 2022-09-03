import './audio-call-page.css';
import { getNewWindowGame } from '../audio-call-game/game/startNewGame/game';

export default async function getAudioCallPage(): Promise<HTMLElement> {
  const elem = getNewWindowGame();
  elem.className = 'audio-call-page';
  return elem;
}
