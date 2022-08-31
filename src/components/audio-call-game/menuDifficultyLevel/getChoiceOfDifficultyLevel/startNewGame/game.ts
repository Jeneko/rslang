import { getWords } from 'API/index';
import { updateState, getState } from 'utils/state';
import { Word } from 'types/index';
import { GameState } from 'game.types';
import controlGameWindow from 'components/audio-call-game/menuDifficultyLevel/controlGameWindow/controlGameWindow';
import createMenuGame from 'components/audio-call-game/createMenuGame';
import generateWindowGame from './generateWindowGame/generateWindowGame';
import { CHECKICON, WRONGICON } from './addEventsForChoiceButtons/addEventsForChoiceButtons';

const MAX_PAGE_NUM = 30;

export async function startNewGame(event: Event): Promise<void> {
  const buttonCheck = event.target as HTMLElement;
  const buttonsWrapper = document.querySelector('.button-wrapper-audiocall');
  if (buttonsWrapper) {
    buttonsWrapper?.remove();
  }
  const blockButtonNextQuestion = document.createElement('div');
  blockButtonNextQuestion.classList.add('button-wrapper-audiocall');
  blockButtonNextQuestion.innerHTML = `
  <button type="button" class="btn btn-primary btn-next-question btn--hidden">I do not know</button>
  `;
  const windowGameBlock = document.querySelector('.audio-call-game');
  const state: GameState = {
    correctAnswers: [],
    wrongAnswers: [],
    currentLevel: +(buttonCheck.dataset.level as String),
  };
  if (buttonCheck.classList.contains('btn-check') || buttonCheck.classList.contains('btn-play-again')) {
    const currentLevel = (buttonCheck.dataset.level);
    controlGameWindow();
    if (currentLevel) {
      const randomPage = Math.trunc(Math.random() * MAX_PAGE_NUM);
      updateState('indexWord', 0);
      const listWords = await getWords(+currentLevel, randomPage);
      await generateWindowGame(listWords[0], listWords, state);
      windowGameBlock?.append(blockButtonNextQuestion);
      addEventsForNextQuestionButton(randomPage, listWords, state);
    }
  }
}

export function addEventsForNextQuestionButton(numberPage: number, listWords: Word[], gameState: GameState): void {
  const buttonNextQuestion = document.querySelector('.btn-next-question');
  buttonNextQuestion?.addEventListener('click', () => {
    buttonNextQuestion.textContent = 'I do not know';
    const currentIndex = getState().indexWord + 1;
    updateState('indexWord', currentIndex);
    clearGameWindow();
    if (currentIndex >= listWords.length) {
      const modalGameResult = getModalResultGame(gameState);
      playAgainButtonClickHandler(modalGameResult);
      showResult(modalGameResult, gameState);
    } else {
      generateWindowGame(listWords[currentIndex], listWords, gameState);
    }
  });
}

export function clearGameWindow(): void {
  const gameWindow = document.querySelector('.game-window');
  while (gameWindow?.firstChild) {
    gameWindow.firstChild.remove();
  }
}

export function getNewWindowGame(): HTMLElement {
  const menu = document.createElement('div');
  menu.append(createMenuGame());
  const menuLevels = menu.querySelector('.btn-group');
  menuLevels?.addEventListener('click', startNewGame);
  return menu;
}

function getAllAnswersForGame(list: Word[], blockList: HTMLElement, correctAnswers: boolean) {
  const iconQuestion = correctAnswers ? CHECKICON : WRONGICON;
  const fragment = document.createDocumentFragment();
  list.forEach((el) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.innerHTML = `${iconQuestion} ${el.word} | ${el.wordTranslate}`;
    fragment.append(listItem);
  });
  blockList.append(fragment);
}

function getModalResultGame(gameState: GameState) {
  const modalResultGame = document.createElement('div');
  modalResultGame.classList.add('popup-winner-audio-call');
  modalResultGame.innerHTML = `
  <div id="modal-winner" class="modal-body">
    <h3>Correct answers (${gameState.correctAnswers.length})</h3>
    <ul class="list-group list-group-correct">
    </ul>
    <h3>Wrong answers (${gameState.wrongAnswers.length})</h3>
    <ul class="list-group list-group-wrong">
    </ul>
    <button type="button" data-level="${gameState.currentLevel}" class="btn btn-play-again btn-primary">Играть еще раз</button>
  </div>
  `;
  return modalResultGame;
}

function playAgainButtonClickHandler(modalResultGame: HTMLElement) {
  const buttonPlayAgain = modalResultGame.querySelector('.btn-play-again');
  buttonPlayAgain?.addEventListener('click', () => {
    const gameWindow = document.querySelector('.game-window') as HTMLElement;
    const wrapper = document.querySelector('.wrapper') as HTMLElement;
    wrapper.innerHTML = '';
    gameWindow.innerHTML = '';
    const newWindowGame = getNewWindowGame();
    wrapper.append(newWindowGame);
  });
}

function showResult(modalResultGame: HTMLElement, gameState: GameState) {
  const buttonNextQuestion = document.querySelector('.btn-next-question');
  const parentModal = document.querySelector('.game-window');
  const blockListCorrect = modalResultGame.querySelector('.list-group-correct') as HTMLElement;
  const blockListWrong = modalResultGame.querySelector('.list-group-wrong') as HTMLElement;
  const { correctAnswers, wrongAnswers } = gameState;

  getAllAnswersForGame(correctAnswers, blockListCorrect, true);
  getAllAnswersForGame(wrongAnswers, blockListWrong, false);

  buttonNextQuestion?.remove();
  parentModal?.append(modalResultGame);
}
