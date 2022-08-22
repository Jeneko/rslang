import { renderModal, generateWords } from './modal-lvl';
import {
  chooseWords,
  deleteShownWord,
  isCurrentTranslate,
  loadingBar,
  renderGame,
  timer,
  updateGame,
} from './sprint-game-window';
import { sprintState, unableSprintState } from './sprint-state';

export default function getSprintGame(): HTMLDivElement {
  const elem = document.createElement('div');
  elem.className = 'sprint-game';
  elem.innerHTML = renderModal;
  sprintHandler(elem);
  return elem;
}

export const sprintHandler = (elem: HTMLElement): void => {
  elem.addEventListener('click', async (event: MouseEvent) => {
    const { classList } = event.target as Element;
    const gameWindow = elem.querySelector('.sprint') as HTMLElement;

    if (classList.contains('btn-lvl')) {
      gameWindow.innerHTML = loadingBar;
      const target = event.target as HTMLElement;
      const { lvl } = target.dataset;
      sprintState.words = await generateWords(Number(lvl));
      sprintState.wordsIndexes = sprintState.words.map((_, i) => i);
      unableSprintState();
      sprintState.randomWords = chooseWords(sprintState.words);
      gameWindow.innerHTML = renderGame(sprintState.randomWords);
      timer();
    }
    if (classList.contains('chooseBtn')) {
      if (classList.contains('btn-true')) {
        isCurrentTranslate(sprintState.randomWords, sprintState.randomWords.word === sprintState.randomWords.random);
      } else {
        isCurrentTranslate(sprintState.randomWords, sprintState.randomWords.word !== sprintState.randomWords.random);
      }
      sprintState.wordsIndexes = deleteShownWord(sprintState.wordsIndexes, sprintState.randomWords.word);
      sprintState.randomWords = chooseWords(sprintState.words);
      updateGame(sprintState.randomWords, elem);
      console.log(sprintState.wordsIndexes);
    }
    if (classList.contains('results__close-button')) {
      elem.innerHTML = renderModal;
    }
  });

  document.addEventListener('keyup', (event: KeyboardEvent) => {
    const chooseBtn = elem.querySelector('.chooseBtn') as HTMLButtonElement;
    const leftButton = elem.querySelector('.btn-true') as HTMLButtonElement;
    const rightButton = elem.querySelector('.btn-false') as HTMLButtonElement;
    if (chooseBtn) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        leftButton.blur();
        leftButton.click();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        rightButton.blur();
        rightButton.click();
      }
    }
  });

  document.addEventListener('keydown', (event: KeyboardEvent) => {
    const chooseBtn = elem.querySelector('.chooseBtn') as HTMLButtonElement;
    const leftButton = elem.querySelector('.btn-true') as HTMLButtonElement;
    const rightButton = elem.querySelector('.btn-false') as HTMLButtonElement;
    if (chooseBtn) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        leftButton.focus();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        rightButton.focus();
      }
    }
  });
};
