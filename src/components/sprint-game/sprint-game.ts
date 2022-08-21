import { renderModal, generateWords } from './modal-lvl';
import {
  chooseWords,
  deleteShownWord,
  isCurrentTranslate,
  isNotCurrentTranslate,
  loadingBar,
  renderGame,
  timer,
  updateGame,
} from './sprint-game-window';
import { sprintState, unableSprintState } from './sprint-state';

export default function getSprintGame() {
  const elem = document.createElement('div');
  elem.className = 'sprint-game';
  elem.innerHTML = renderModal();
  sprintHandler(elem);
  return elem;
}

export const sprintHandler = (elem: HTMLElement) => {
  elem.addEventListener('click', async (event: MouseEvent) => {
    const { classList } = event.target as Element;
    const gameWindow = document.querySelector('.sprint') as HTMLElement;

    if (classList.contains('btn-lvl')) {
      gameWindow.innerHTML = loadingBar();
      const { id } = event.target as HTMLButtonElement;
      const lvl = Number(id.split('-')[1]);
      sprintState.words = await generateWords(lvl);
      unableSprintState();
      sprintState.randomWords = chooseWords(sprintState.words);
      gameWindow.innerHTML = renderGame(sprintState.randomWords);
      timer();
    }
    if (classList.contains('chooseBtn')) {
      if (classList.contains('btn-true')) {
        isCurrentTranslate(sprintState.randomWords);
      } else {
        isNotCurrentTranslate(sprintState.randomWords);
      }
      sprintState.words = deleteShownWord(sprintState.words, sprintState.randomWords.word);
      sprintState.randomWords = chooseWords(sprintState.words);
      updateGame(sprintState.randomWords);
    }
    if (classList.contains('results__close-button')) {
      (document.querySelector('.sprint-game') as HTMLElement).innerHTML = renderModal();
    }
  });

  document.addEventListener('keyup', (event: KeyboardEvent) => {
    const chooseBtn = document.querySelector('.chooseBtn') as HTMLButtonElement;
    if (chooseBtn) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        isCurrentTranslate(sprintState.randomWords);
        sprintState.words = deleteShownWord(sprintState.words, sprintState.randomWords.word);
        sprintState.randomWords = chooseWords(sprintState.words);
        updateGame(sprintState.randomWords);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        isNotCurrentTranslate(sprintState.randomWords);
        sprintState.words = deleteShownWord(sprintState.words, sprintState.randomWords.word);
        sprintState.randomWords = chooseWords(sprintState.words);
        updateGame(sprintState.randomWords);
      }
    }
  });
};
