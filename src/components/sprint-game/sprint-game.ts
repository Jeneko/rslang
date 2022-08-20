import { Word } from 'types/index';
import { renderModal, generateWords } from './modal-lvl';
import {
  chooseWords, isCurrentTranslate, isNotCurrentTranslate, renderGame, timer,
} from './sprint-game-window';

// Dummy function content (to be replaced)
// export default async function getSprintGame(): Promise<HTMLElement> {
//   const words = await getWords(0, 0);
//   const elem = document.createElement('div');
//   elem.className = 'sprint-game';

//   elem.innerHTML = `
//     <h2>Sprint mini-game</h2>
//     <pre>
//       ${JSON.stringify(words, null, 2)}
//     </pre>
//   `;

//   return elem;
// }

export default function getSprintGame() {
  const elem = document.createElement('div');
  elem.className = 'sprint-game';
  elem.innerHTML = renderModal();
  sprintHandler(elem);
  return elem;
}

export const sprintHandler = (elem: HTMLElement) => {
  let words: Word[];
  elem?.addEventListener('click', async (event: MouseEvent) => {
    const { classList } = event.target as Element;
    const gameWindow = document.querySelector('.sprint') as HTMLElement;
    if (classList.contains('btn-lvl')) {
      const { id } = event.target as HTMLButtonElement;
      const lvl = Number(id.split('-')[1]);
      words = await generateWords(lvl);
      chooseWords(words);
      gameWindow.innerHTML = renderGame();
      timer(gameWindow);
    }
    if (classList.contains('btn-true')) {
      isCurrentTranslate();
      chooseWords(words);
      gameWindow.innerHTML = renderGame();
    }
    if (classList.contains('btn-false')) {
      isNotCurrentTranslate();
      chooseWords(words);
      gameWindow.innerHTML = renderGame();
    }
  });
};
