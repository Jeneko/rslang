import createMenuGame from 'components/audio-call-game/createMenuGame';
import './audio-call-page.css';
import getChoiceOfDifficultyLevel from '../audio-call-game/menuDifficultyLevel/getChoiceOfDifficultyLevel/getChoiceOfDifficultyLevel';

export default async function getAudioCallPage(): Promise<HTMLElement> {
  const elem = document.createElement('div');
  elem.className = 'audio-call-page';

  elem.append(await createMenuGame());
  await getChoiceOfDifficultyLevel(elem);
  return elem;
}
