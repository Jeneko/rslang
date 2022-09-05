import './audio-call-page.css';
import { getNewWindowGame } from '../audio-call-game/game/startNewGame/game';

export default async function getAudioCallPage(): Promise<HTMLElement> {
  document.querySelector('.audio-call-page')?.remove();
  const elem = getNewWindowGame();
  elem.className = 'audio-call-page';
  return elem;
}
