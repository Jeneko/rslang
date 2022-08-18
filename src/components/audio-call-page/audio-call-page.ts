import getAudioCallGame from 'components/audio-call-game/audio-call-game';
import './audio-call-page.css';
import choiceOfDifficultyLevel from '../audio-call-game/menuDifficultyLevel/choiceOfDifficultyLevel/choiceOfDifficultyLevel';

export default async function getAudioCallPage(): Promise<HTMLElement> {
  const elem = document.createElement('div');
  elem.className = 'audio-call-page';

  elem.append(await getAudioCallGame());
  document.addEventListener('DOMContentLoaded', async () => {
    choiceOfDifficultyLevel();
  });
  return elem;
}
