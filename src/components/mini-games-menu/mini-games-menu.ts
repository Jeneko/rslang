import './mini-games-menu.css';

export default function getMiniGamesMenu(): HTMLElement {
  const elem = document.createElement('div');
  elem.className = 'mini-games-menu';

  elem.innerHTML = `
    <h2>Mini-Games</h2>
    <p>Start playing from here</p>
    <button class="btn btn-primary">Audio-Call</button>
    <button class="btn btn-primary">Sprint</button>
  `;

  return elem;
}
