import { getWords, getWord } from 'API/index';
import { updateState, getState } from 'utils/state';
import { Word } from 'types/index';
import { GameState } from 'game.types';
import controlGameWindow from 'components/audio-call-game/menuDifficultyLevel/controlGameWindow/controlGameWindow';
import createMenuGame from 'components/audio-call-game/createMenuGame';
import generateWindowGame from './generateWindowGame/generateWindowGame';
import showCurrentWordInfo from './addEventsForChoiceButtons/showCurrentWordInfo/showCurrentWordInfo';
import { CHECKICON, WRONGICON } from './addEventsForChoiceButtons/addEventsForChoiceButtons';
import hiddenAllButtons from './addEventsForChoiceButtons/disableAllButtonsChoice/disableAllButtonsChoice';

const MAX_PAGE_NUM = 30;

export async function startNewGame(event: Event): Promise<void> {
  console.log(event.target);
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
  if (buttonCheck.classList.contains('btn-select-level') || buttonCheck.classList.contains('btn-play-again')) {
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
  const buttonNextQuestion = document.querySelector('.btn-next-question') as HTMLElement;
  buttonNextQuestion.setAttribute('wordchosen', 'false');
  buttonNextQuestion?.addEventListener('click', async () => {
    buttonNextQuestion.textContent = 'I do not know';
    const currentIndex = getState().indexWord;
    console.log(currentIndex);
    if (currentIndex >= listWords.length) {
      clearGameWindow();
      const modalGameResult = getModalResultGame(gameState);
      playAgainButtonClickHandler(modalGameResult);
      showResult(modalGameResult, gameState);
      updateState('indexWord', currentIndex + 1);
    } else if (buttonNextQuestion.getAttribute('wordchosen') === 'false') {
      hiddenAllButtons();
      showCurrentWordInfo();
      buttonNextQuestion.textContent = 'Next question';
      buttonNextQuestion.setAttribute('wordchosen', 'true');
      const wordId = (document.querySelector('.current-word-info') as HTMLElement).dataset.id as string;
      const word = await getWord(wordId as string);
      console.log(wordId);
      gameState.wrongAnswers.push(word);
    } else {
      buttonNextQuestion.setAttribute('wordchosen', 'false');
      clearGameWindow();
      generateWindowGame(listWords[currentIndex], listWords, gameState);
      updateState('indexWord', currentIndex + 1);
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
  const menu = document.querySelector('.audio-call-page') as HTMLElement || document.createElement('div') as HTMLElement;
  menu.append(createMenuGame());
  menu.setAttribute('tabindex', '-1');
  const menuLevels = menu.querySelector('.btn-wrapper');
  console.log(menuLevels);
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
    <button type="button" data-level="${gameState.currentLevel}" class="btn btn-play-again btn-primary">Play again</button>
  </div>
  `;
  return modalResultGame;
}

function playAgainButtonClickHandler(modalResultGame: HTMLElement) {
  const buttonPlayAgain = modalResultGame.querySelector('.btn-play-again');
  buttonPlayAgain?.addEventListener('click', () => {
    const gameWindow = document.querySelector('.game-window') as HTMLElement;
    const wrapper = document.querySelector('.audio-call-page') as HTMLElement;
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
