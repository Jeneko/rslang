import { getAllUserWords, getWord } from 'API/index';
import { PageName, WordStatus } from 'types/index';
import { getAuth } from 'utils/auth';
import * as state from 'utils/state';
import { renderModal, generateWords } from './modal-lvl';
import {
  chooseWords, deleteShownWord, isCurrentTranslate, loadingBar, modalResults, renderGame, timer, updateGame,
} from './sprint-game-window';
import { sprintState, setDefaultSprintState } from './sprint-state';

export default async function getSprintGame(): Promise<HTMLDivElement> {
  const elem = document.createElement('div');
  elem.className = 'sprint-game';
  elem.innerHTML = renderModal;
  if (state.getState().page === PageName.studyBook) {
    const gameWindow = elem.querySelector('.sprint') as HTMLElement;
    gameWindow.innerHTML = loadingBar;
    const lvl = state.getState().studyBookChapter as number;
    const currentPage = state.getState().studyBookPage as number;
    createGame(lvl, currentPage, gameWindow);
  }
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
      createGame(Number(lvl), 30, gameWindow);
    }
    if (classList.contains('chooseBtn')) {
      const isRandom = sprintState.randomWords.word === sprintState.randomWords.random;
      isCurrentTranslate(sprintState.randomWords, classList.contains('btn-true') ? isRandom : !isRandom);
      sprintState.wordsIndexes = deleteShownWord(sprintState.wordsIndexes, sprintState.randomWords.word);
      sprintState.randomWords = chooseWords(sprintState.wordsIndexes);
      if (sprintState.wordsIndexes.length) {
        updateGame(sprintState.randomWords, elem);
      } else {
        gameWindow.innerHTML = modalResults();
      }
    }
    if (classList.contains('results__close-button')) {
      elem.innerHTML = renderModal;
    }
  });

  document.addEventListener('keyup', (event: KeyboardEvent) => {
    const leftButton = elem.querySelector('.btn-true') as HTMLButtonElement;
    const rightButton = elem.querySelector('.btn-false') as HTMLButtonElement;

    if (elem.querySelector('.chooseBtn')) {
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
    const leftButton = elem.querySelector('.btn-true') as HTMLButtonElement;
    const rightButton = elem.querySelector('.btn-false') as HTMLButtonElement;

    if (elem.querySelector('.chooseBtn')) {
      if (event.key === 'ArrowLeft') {
        leftButton.focus();
      }
      if (event.key === 'ArrowRight') {
        rightButton.focus();
      }
    }
  });
};

const createGame = async (lvl: number, currentPage: number, elem: HTMLElement): Promise<void> => {
  const auth = getAuth();

  if (auth) {
    await getWordsForRegisterMember(lvl, currentPage);
  } else {
    sprintState.words = await generateWords(Number(lvl), currentPage);
  }

  sprintState.wordsIndexes = sprintState.words.map((_, i) => i);
  setDefaultSprintState();
  sprintState.randomWords = chooseWords(sprintState.wordsIndexes);
  elem.innerHTML = renderGame(sprintState.randomWords);
  timer();
};

const getWordsForRegisterMember = async (lvl: number, currentPage: number): Promise<void> => {
  sprintState.userWords = await getAllUserWords();
  if (lvl === 7) {
    const hardWordsId = sprintState.userWords.filter((word) => word.difficulty === WordStatus.hard).map((word) => word.wordId);
    const hardWord = Promise.all(hardWordsId.map((id) => getWord(id)));
    sprintState.words = await hardWord;
  } else {
    const allWords = await generateWords(Number(lvl), currentPage);
    const wordsForGame = sprintState.userWords.filter((word) => word.difficulty === WordStatus.learned).map((word) => word.wordId);
    sprintState.words = allWords.filter((word) => !wordsForGame.includes(word.id));
  }
};
