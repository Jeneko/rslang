import getSprintGame from 'components/sprint-game/sprint-game';
import './sprint-page.css';

export default async function getSprintPage(): Promise<HTMLElement> {
  const elem = document.createElement('div');
  elem.className = 'sprint-page';

  elem.append(await getSprintGame());

  return elem;
}
