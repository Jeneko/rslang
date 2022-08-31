import getAudioCallPage from 'components/audio-call-page/audio-call-page';
import getHeader from 'components/header/header';
import getSprintPage from 'components/sprint-page/sprint-page';
import { PageName } from 'types/index';
import * as state from 'utils/state';
import './mini-games-menu.css';

export default function getMiniGamesMenu(): HTMLElement {
  const elem = document.createElement('div');
  elem.className = 'mini-games-menu';

  elem.innerHTML = `
    <h2>Mini-Games</h2>
    <p>Start playing from here</p>
    <button class="btn btn-primary game" data-link="audio-call">Audio-Call</button>
    <button class="btn btn-primary game" data-link="sprint">Sprint</button>
  `;

  handleMiniGamesMenu(elem);

  return elem;
}

const handleMiniGamesMenu = (elem: HTMLElement) => {
  elem.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('game')) {
      const { link } = target.dataset;
      document.body.innerHTML = '';
      document.body.append(getHeader());
      console.log(link);
      if (link === PageName.sprint) {
        document.body.append(await getSprintPage());
      }
      if (link === PageName.audioCall) {
        document.body.append(await getAudioCallPage());
      }
      state.updateState('page', link as string);
    }
  });
};
