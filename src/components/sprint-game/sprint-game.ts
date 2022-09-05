import { getAllUserWords } from 'API/index';
import { outputAlert } from 'components/alert-message/alert-message';
import playAudio from 'components/audio-call-game/game/startNewGame/playAudio/playAudio';
import { showLoadSpinner } from 'components/load-spinner/load-spinner';
import { AlertType, PageName, WordStatus } from 'types/index';
import { getAuth } from 'utils/auth';
import * as state from 'utils/state';
import { getAllUserWordsWithData } from 'utils/user-words';
import { renderModal, generateWords } from './modal-lvl';
import {
  chooseWords,
  subtractShownWordIdx,
  currentTranslateCheck,
  modalResults,
  renderGame,
  startTimer,
  updateGame,
} from './sprint-game-window';
import { sprintState, setDefaultSprintState } from './sprint-state';
import statistic from './statistic';

const PAGES_NUMBER = 30;
const HARD_WORDS_PAGE = 6;

export default async function getSprintGame(): Promise<HTMLDivElement> {
  const elem = document.createElement('div');
  elem.className = 'sprint-game container';
  elem.innerHTML = renderModal;
  if (state.getState().page === PageName.studyBook) {
    (elem.querySelector('.modal-lvl') as HTMLElement).style.display = 'none';
    const gameWindow = elem.querySelector('.sprint') as HTMLElement;
    const { studyBookChapter, studyBookPage } = state.getState();
    createGame(+studyBookChapter, +studyBookPage, gameWindow);
  }
  sprintHandler(elem);
  return elem;
}

export const sprintHandler = (elem: HTMLElement): void => {
  elem.addEventListener('click', async (event: MouseEvent) => {
    const { classList } = event.target as Element;
    const gameWindow = elem.querySelector('.sprint') as HTMLElement;

    (elem.querySelector('.choose-buttons') as HTMLElement)?.focus();

    if (classList.contains('btn-lvl')) {
      const target = event.target as HTMLElement;
      const { lvl } = target.dataset;
      createGame(Number(lvl), PAGES_NUMBER, gameWindow);
    }
    if (classList.contains('chooseBtn')) {
      const isRandom = sprintState.randomWords.curWordIdx === sprintState.randomWords.randomIdx;
      currentTranslateCheck(sprintState.randomWords, classList.contains('btn-true') ? isRandom : !isRandom);
      sprintState.wordsIndexes = subtractShownWordIdx(sprintState.wordsIndexes, sprintState.randomWords.curWordIdx);
      if (sprintState.wordsIndexes.length) {
        sprintState.randomWords = chooseWords(sprintState.wordsIndexes);
        updateGame(sprintState.randomWords, elem);
      } else {
        gameWindow.innerHTML = modalResults();

        if (getAuth()) {
          statistic();
        }
      }
    }
    if (classList.contains('results__close-button')) {
      elem.innerHTML = renderModal;
    }
    if (classList.contains('button-audio-image')) {
      const target = event.target as HTMLElement;
      const { audio } = target.dataset;
      playAudio(audio as string);
    }
  });

  elem.addEventListener('keyup', (event: KeyboardEvent) => {
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

  elem.addEventListener('keydown', (event: KeyboardEvent) => {
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
  const message = elem.querySelector('.message') as HTMLElement;

  if (getAuth()) {
    showLoadSpinner(true);
    await getWordsForRegisterMember(lvl, currentPage);
  } else {
    if (lvl === HARD_WORDS_PAGE) {
      outputAlert(message, AlertType.info, messageHardWords);
      return;
    }
    showLoadSpinner(true);
    sprintState.words = await generateWords(Number(lvl), currentPage);
  }

  if (sprintState.words.length) {
    sprintState.wordsIndexes = sprintState.words.map((_, i) => i);
    setDefaultSprintState();
    sprintState.randomWords = chooseWords(sprintState.wordsIndexes);
    elem.innerHTML = renderGame(sprintState.randomWords);
    (elem.querySelector('.choose-buttons') as HTMLElement).focus();
    startTimer();
  } else {
    outputAlert(message, AlertType.info, messageNoWords);
  }

  showLoadSpinner(false);
};

const getWordsForRegisterMember = async (lvl: number, currentPage: number): Promise<void> => {
  if (lvl === HARD_WORDS_PAGE) {
    sprintState.words = await getAllUserWordsWithData();
  } else {
    sprintState.userWords = await getAllUserWords();
    const allWords = await generateWords(Number(lvl), currentPage);
    const wordsForGame = sprintState.userWords
      .filter((word) => word.difficulty === WordStatus.learned)
      .map((word) => word.wordId);
    sprintState.words = allWords.filter((word) => !wordsForGame.includes(word.id));
  }
};

const messageHardWords = `
  Chapter 7 contains the most difficult words user selected manually. Please, <a href="#login" class="load-page-link">Login</a> or <a href="#register" class="load-page-link">Register</a> to start using this chapter.
`;

const messageNoWords = `
  You don't have words in this category! Choose other level.
`;
