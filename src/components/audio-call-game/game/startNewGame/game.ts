import {
  getWords, getWord, getAggregatedWord, getAggregatedWords,
} from 'API/index';
import { updateState, getState } from 'utils/state';
import { Word, WordWithUserWord, AlertType } from 'types/index';
import { GameState } from 'game.types';
import { outputAlert, clearAlerts } from 'components/alert-message/alert-message';
import controlGameWindow from 'components/audio-call-game/game/controlGameWindow/controlGameWindow';
import createMenuGame from 'components/audio-call-game/createMenuGame';
import { getAllUserWordsWithData, setWordOptional } from 'utils/user-words';
import { getAuth } from 'utils/auth';
import { showLoadSpinner } from 'components/load-spinner/load-spinner';
import { sendDataToServer, getAuthWords } from '../sendingToServer/sendingToServer';
import generateWindowGame from './generateWindowGame/generateWindowGame';
import { hiddenAllButtons, showCurrentWordInfo } from './addEventsForChoiceButtons/index';

import playAudio from './playAudio/playAudio';

const MAX_PAGE_NUM = 30;
const USER_LEVEL = 6;
const NEXT_QUESTION = 'Next question';
const SKIP = 'Skip';
const WORD_AMOUNT_FOR_PAGE = 20;

export async function startNewGame(event: Event | null, startPage: HTMLElement | undefined): Promise<void> {
  // play for menu level
  const statusAuth = getAuth();
  if (event) {
    if (!(event?.target as HTMLElement).classList.contains('btn-select-level')) {
      return;
    }
    const level = +((event.target as HTMLElement).dataset.level as string);
    showLoadSpinner(true);
    if (!statusAuth && +((event.target as HTMLElement).dataset.level as string) === USER_LEVEL) {
      if (document.querySelector('.info-no-auth')) {
        showLoadSpinner(false);
        return;
      }
      getModalNoAuth();
      showLoadSpinner(false);
      return;
    }
    if (level === USER_LEVEL && statusAuth) {
      const listWords = await getAllUserWordsWithData();
      if (listWords.length === 0) {
        showLoadSpinner(false);
        addTitleNoHardWords();
        return;
      }
    }
    document.querySelector('.audio-call-message')?.remove();
    document.querySelector('.info-no-auth')?.remove();
    const buttonCheck = event.target as HTMLElement;
    const buttonsWrapper = document.querySelector('.button-wrapper-audiocall');
    buttonsWrapper?.remove();
    checkNoWardsTitle();

    const blockButtonNextQuestion = getButtonNextQuestion();

    const windowGameBlock = document.querySelector('.audio-call-game') as HTMLElement;
    const state: GameState = {
      correctAnswers: [],
      wrongAnswers: [],
      currentLevel: +(buttonCheck.dataset.level as String),
      counterStreakForGame: 0,
      longestStreakForGame: 0,
      newWords: 0,
    };
    if (buttonCheck.classList.contains('btn-select-level') || buttonCheck.classList.contains('btn-play-again')) {
      const currentLevel = (buttonCheck.dataset.level);
      if (currentLevel) {
        const randomPage = Math.trunc(Math.random() * MAX_PAGE_NUM);
        updateState('indexWord', 0);
        let listWords;
        if (statusAuth) {
          if (+currentLevel === USER_LEVEL) {
            listWords = await getAllUserWordsWithData();
          } else {
            listWords = await getAggregatedWords(undefined, WORD_AMOUNT_FOR_PAGE, +currentLevel, randomPage);
            listWords = listWords[0].paginatedResults;
          }
          state.newWords = await checkNewWords(listWords as WordWithUserWord[]);
        } else {
          listWords = await getWords(+currentLevel, randomPage);
        }

        if (checkWrongStartGame(listWords)) {
          return;
        }

        listWords = shuffleArrayRandom(listWords);

        await generateWindowGame(listWords[0], listWords, state);
        windowGameBlock?.append(blockButtonNextQuestion);
        addEventsForNextQuestionButton(windowGameBlock, listWords, state);
        controlGameWindow();
        showLoadSpinner(false);
      }
    }
  } else {
    // play for study-book
    showLoadSpinner(true);
    const currentPage = getState().studyBookPage;
    const currentChapter = getState().studyBookChapter;

    const blockButtonNextQuestion = getButtonNextQuestion();

    const windowGameBlock = startPage?.querySelector('.audio-call-game') as HTMLElement;
    const state: GameState = {
      correctAnswers: [],
      wrongAnswers: [],
      currentLevel: +currentPage,
      counterStreakForGame: 0,
      longestStreakForGame: 0,
      newWords: 0,
    };
    updateState('indexWord', 0);
    let listWords;

    if (currentChapter === USER_LEVEL && statusAuth) {
      listWords = await getAllUserWordsWithData();
      await checkNewWords(listWords);
    } else {
      listWords = statusAuth ? await getAuthWords(currentChapter, currentPage) : await getWords(currentChapter, currentPage);
    }

    listWords = shuffleArrayRandom(listWords);

    state.newWords = statusAuth ? await checkNewWords(listWords as WordWithUserWord[]) : 0;
    await generateWindowGame(listWords[0], listWords, state);
    windowGameBlock?.append(blockButtonNextQuestion);
    addEventsForNextQuestionButton(windowGameBlock, listWords, state);
    controlGameWindow();
    showLoadSpinner(false);
  }
}

export function addEventsForNextQuestionButton(windowGameBlock: HTMLElement, listWords: Word[], gameState: GameState): void {
  const buttonNextQuestion = windowGameBlock.querySelector('.btn-next-question') as HTMLElement;
  buttonNextQuestion.dataset.wordchosen = 'false';
  handleEventsForNextQuestionButton(buttonNextQuestion, listWords, gameState);
}

function handleEventsForNextQuestionButton(buttonNextQuestion: HTMLElement, listWords: Word[], gameState: GameState) {
  buttonNextQuestion?.addEventListener('click', (e: Event) => {
    checkNextQuestion(e, buttonNextQuestion, listWords, gameState);
  });
  buttonNextQuestion.addEventListener('checkNextQuestion', (e: Event) => {
    checkNextQuestion(e, buttonNextQuestion, listWords, gameState);
  });
}

export function clearGameWindow(): void {
  const gameWindow = document.querySelector('.game-window');
  if (document.querySelector('.game-window')) {
    (gameWindow as HTMLElement).innerHTML = '';
  }
}

export function getNewWindowGame(): HTMLElement {
  const previousPage = getState().page;
  let menu = document.querySelector('.audio-call-page');
  if (!menu) {
    menu = document.createElement('div');
    menu.classList.add('audio-call-page');
  }
  if (previousPage === 'study-book') {
    menu.append(createMenuGame(true));
    startNewGame(null, menu as HTMLElement);
  } else {
    menu.append(createMenuGame(false));
    const menuLevels = menu.querySelector('.btn-wrapper');
    menuLevels?.addEventListener('click', (e: Event) => startNewGame(e, undefined));
  }
  return menu as HTMLElement;
}

function addAllAnswersForPage(list: Word[], blockList: HTMLElement) {
  const fragment = document.createDocumentFragment();
  list.forEach((el) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.innerHTML = `<button class="button-audio-result"><img class="button-audio-image" src="assets/speaker-icon.svg"></button> ${el.word} | ${el.wordTranslate}`;
    const buttonAudio = listItem.querySelector('.button-audio-result');
    buttonAudio?.addEventListener('click', () => {
      playAudio(el.audio);
    });
    fragment.append(listItem);
  });
  blockList.append(fragment);
}

function getModalResultGame(gameState: GameState): HTMLElement {
  const modalResultGame = document.createElement('div');
  modalResultGame.classList.add('popup-winner-audio-call');
  modalResultGame.innerHTML = `
    <div id="modal-winner" class="modal-body">
      <h3>Your longest string of guessed ${gameState.longestStreakForGame} words!</h3>
      <h3>Correct answers (${gameState.correctAnswers.length})</h3>
      <ul class="list-group list-group-correct">
      </ul>
      <h3>Wrong answers (${gameState.wrongAnswers.length})</h3>
      <ul class="list-group list-group-wrong">
      </ul>
      <button type="button" data-level="${gameState.currentLevel}" class="btn btn-play-again btn-primary">Play again</button>
    </div>
  `;
  return modalResultGame;
}

function playAgainButtonClickHandler(modalResultGame: HTMLElement): void {
  const buttonPlayAgain = modalResultGame.querySelector('.btn-play-again');
  buttonPlayAgain?.addEventListener('click', () => {
    const wrapper = document.querySelector('.audio-call-page') as HTMLElement;
    wrapper.innerHTML = '';
    clearGameWindow();
    getNewWindowGame();
  });
}

async function showResult(modalResultGame: HTMLElement, gameState: GameState): Promise<void> {
  const buttonNextQuestion = document.querySelector('.btn-next-question');
  const parentModal = document.querySelector('.game-window');
  const blockListCorrect = modalResultGame.querySelector('.list-group-correct') as HTMLElement;
  const blockListWrong = modalResultGame.querySelector('.list-group-wrong') as HTMLElement;
  const { correctAnswers, wrongAnswers } = gameState;

  if (getAuth()) {
    await sendDataToServer(correctAnswers as WordWithUserWord[], wrongAnswers as WordWithUserWord[], gameState);
  }

  addAllAnswersForPage(correctAnswers, blockListCorrect);
  addAllAnswersForPage(wrongAnswers, blockListWrong);

  buttonNextQuestion?.remove();
  parentModal?.append(modalResultGame);
}

export async function checkNextQuestion(e: Event, buttonNextQuestion: HTMLElement, listWords: Word[], gameState: GameState): Promise<void> {
  const currentIndex = getState().indexWord + 1;

  if (currentIndex >= listWords.length && buttonNextQuestion.dataset.status === 'true') {
    document.querySelector('.button-wrapper-audiocall')?.remove();
    showLoadSpinner(true);
    clearGameWindow();
    const modalGameResult = getModalResultGame(gameState);
    playAgainButtonClickHandler(modalGameResult);
    await showResult(modalGameResult, gameState);
    updateState('indexWord', currentIndex);
    showLoadSpinner(false);
  } else if (buttonNextQuestion.dataset.wordchosen === 'false') {
    hiddenAllButtons();
    showCurrentWordInfo();
    buttonNextQuestion.textContent = NEXT_QUESTION;
    buttonNextQuestion.dataset.wordchosen = 'true';
    buttonNextQuestion.dataset.status = 'true';
    const wordId = (document.querySelector('.current-word-info') as HTMLElement).dataset.id as string;
    const word = getAuth() ? await getAggregatedWord(wordId) : await getWord(wordId);
    gameState.wrongAnswers.push(word as Word);
  } else {
    buttonNextQuestion.textContent = SKIP;
    buttonNextQuestion.dataset.status = 'false';
    buttonNextQuestion.dataset.wordchosen = 'false';
    clearGameWindow();
    generateWindowGame(listWords[currentIndex], listWords, gameState);
    updateState('indexWord', currentIndex);
  }
}

async function checkNewWords(array: WordWithUserWord[]): Promise<number> {
  let counterNewWords = 0;
  const promiseArray = [];
  for (let i = 0; i < array.length; i += 1) {
    const el = array[i];
    if (el.userWord) {
      if (!el.userWord.optional.guessedWrong && !el.userWord.optional.guessedRight) {
        counterNewWords += 1;
      }
    } else {
      const defaultOptional = {
        guessedInRow: 0,
        guessedRight: 0,
        guessedWrong: 0,
      };
      counterNewWords += 1;
      // eslint-disable-next-line no-underscore-dangle
      promiseArray.push(setWordOptional(el._id as string, defaultOptional));
    }
  }
  await Promise.all(promiseArray);
  return counterNewWords;
}

function addTitleNoHardWords(): void {
  const modalInfo = document.querySelector('.audio-call-message') as HTMLElement;
  clearAlerts(modalInfo);
  const text = 'You do not have hard words! Learn more in the  <a class="load-page-link" href="#study-book">study book</a>!';

  outputAlert(modalInfo, AlertType.info, text);
}

function checkNoWardsTitle(): void {
  const elem = document.querySelector('.no-hard-words-info');
  if (elem) {
    elem.remove();
  }
}

function getButtonNextQuestion(): HTMLElement {
  const blockButtonNextQuestion = document.createElement('div');
  blockButtonNextQuestion.classList.add('button-wrapper-audiocall');
  blockButtonNextQuestion.innerHTML = `
    <button type="button" data-status="false" class="btn btn-primary btn-next-question">${SKIP}</button>
  `;
  return blockButtonNextQuestion;
}

function getModalNoAuth(): void {
  const modalInfo = document.querySelector('.audio-call-message') as HTMLElement;
  clearAlerts(modalInfo);
  const text = 'Chapter 7 contains the most difficult words user selected manually. Please, <a class="load-page-link" href="#login">Login</a> or <a class="load-page-link" href="#register">Register</a> to start using this chapter.';

  outputAlert(modalInfo, AlertType.info, text);
}

function checkWrongStartGame(listWords: Word[]): Boolean {
  if (!listWords.length) {
    if (document.querySelector('.info-no-auth')) {
      showLoadSpinner(false);
      return true;
    }
    if (document.querySelector('.no-hard-words-info')) {
      return true;
    }
  }
  showLoadSpinner(false);
  return false;
}

function shuffleArrayRandom(array: Word[]) {
  return array.sort(() => Math.random() - 0.5);
}
