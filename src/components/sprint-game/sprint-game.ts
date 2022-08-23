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
import { sprintState, defaultSprintState } from './sprint-state';

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
      defaultSprintState();
      sprintState.randomWords = chooseWords(sprintState.words);
      gameWindow.innerHTML = renderGame(sprintState.randomWords);
      timer();
    }
    if (classList.contains('chooseBtn')) {
      const isRandom = sprintState.randomWords.word === sprintState.randomWords.random;
      isCurrentTranslate(sprintState.randomWords, classList.contains('btn-true') ? isRandom : !isRandom);
      sprintState.wordsIndexes = deleteShownWord(sprintState.wordsIndexes, sprintState.randomWords.word);
      sprintState.randomWords = chooseWords(sprintState.words);
      updateGame(sprintState.randomWords, elem);
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
      event.preventDefault();
      if (event.key === 'ArrowLeft') {
        leftButton.blur();
        leftButton.click();
      }
      if (event.key === 'ArrowRight') {
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
      event.preventDefault();
      if (event.key === 'ArrowLeft') {
        leftButton.focus();
      }
      if (event.key === 'ArrowRight') {
        rightButton.focus();
      }
    }
  });
};
