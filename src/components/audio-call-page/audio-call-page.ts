import getAudioCallGame from 'components/audio-call-game/audio-call-game';
import './audio-call-page.css';

export default async function getAudioCallPage(): Promise<HTMLElement> {
  const elem = document.createElement('div');
  elem.className = 'audio-call-page';

  elem.append(await getAudioCallGame());

  return elem;
}
