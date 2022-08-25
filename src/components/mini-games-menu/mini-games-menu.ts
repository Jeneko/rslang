import * as state from 'utils/state';
import './mini-games-menu.css';

export default function getMiniGamesMenu(): HTMLElement {
  const elem = document.createElement('div');
  elem.className = 'mini-games-menu';

  elem.innerHTML = `
    <h2>Mini-Games</h2>
    <p>Start playing from here</p>
    <button class="btn btn-primary game">Audio-Call</button>
    <button class="btn btn-primary game">Sprint</button>
  `;

  handleMiniGamesMenu(elem);

  return elem;
}

const handleMiniGamesMenu = (elem: HTMLElement) => {
  elem.addEventListener('click', async (event) => {
    const target = event.target as Element;
    if (target.classList.contains('game')) {
      const link = target.textContent as string;
      state.updateState('page', link.toLowerCase());
      elem.dispatchEvent(new Event('loadPage', { bubbles: true }));
    }
  });
};
