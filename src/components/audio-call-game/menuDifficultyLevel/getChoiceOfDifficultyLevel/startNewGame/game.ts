import { getWords } from 'API/index';
import { updateState, getState } from 'utils/state';
import { Word } from 'types/index';
import { GameState } from 'game.types';
import controlGameWindow from 'components/audio-call-game/menuDifficultyLevel/controlGameWindow/controlGameWindow';
import createMenuGame from 'components/audio-call-game/createMenuGame';
import generateWindowGame from './generateWindowGame/generateWindowGame';
import { CHECKICON, WRONGICON } from './addEventsForChoiceButtons/addEventsForChoiceButtons';

export async function startNewGame(event: Event): Promise<void> {
  const ButtonCheck = event.target as HTMLElement;
  const buttonsWrapper = document.querySelector('.button-wrapper-audiocall');
  if (buttonsWrapper) {
    buttonsWrapper.remove();
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
    currentLevel: ButtonCheck.dataset.level as string,
  };
  if (ButtonCheck.classList.contains('btn-check') || ButtonCheck.classList.contains('btn-play-again')) {
    const currentLevel = (ButtonCheck.dataset.level);
    controlGameWindow();
    if (currentLevel) {
      const randomPage = Math.trunc(Math.random() * 30);
      updateState('indexWord', 0);
      const listWords = await getWords(+currentLevel, randomPage);
      await generateWindowGame(listWords[0], listWords, state);
      windowGameBlock?.append(blockButtonNextQuestion);
      addEventsForNextQuestionButton(randomPage, listWords, state);
    }
  }
}

export function showGameResult(gameState: GameState): void {
  const modalResultGame = document.createElement('div');
  const parentModal = document.querySelector('.game-window');
  const buttonNextQuestion = document.querySelector('.btn-next-question');
  modalResultGame.classList.add('popup-winner-audio-call');
  modalResultGame.innerHTML = `
  <div id="modal-winner" class="modal-body">
    <h3>Верные ответы (${gameState.correctAnswers.length})</h3>
    <ul class="list-group list-group-correct">
    </ul>
    <h3>Ошибочные ответы (${gameState.wrongAnswers.length})</h3>
    <ul class="list-group list-group-wrong">
    </ul>
    <button type="button" data-level="${gameState.currentLevel}" class="btn btn-play-again btn-primary">Играть еще раз</button>
  </div>
  `;
  const buttonPlayAgain = modalResultGame.querySelector('.btn-play-again');
  buttonPlayAgain?.addEventListener('click', () => {
    const gameWindow = document.querySelector('.game-window') as HTMLElement;
    const wrapper = document.querySelector('.wrapper') as HTMLElement;
    wrapper.innerHTML = '';
    gameWindow.innerHTML = '';
    const newGame = getChoiceOfDifficultyLevel();
    wrapper.append(newGame);
  });
  const blockListCorrect = modalResultGame.querySelector('.list-group-correct');
  const blockListWrong = modalResultGame.querySelector('.list-group-wrong');
  const { correctAnswers, wrongAnswers } = gameState;
  correctAnswers.forEach((el) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.innerHTML = `${CHECKICON} ${el.word} | ${el.wordTranslate}`;
    blockListCorrect?.append(listItem);
  });
  wrongAnswers.forEach((el) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.innerHTML = `${WRONGICON} ${el.word} | ${el.wordTranslate}`;
    blockListWrong?.append(listItem);
  });
  buttonNextQuestion?.remove();
  parentModal?.append(modalResultGame);
}

export function addEventsForNextQuestionButton(numberPage: number, listWords: Word[], gameState: GameState): void {
  const buttonNextQuestion = document.querySelector('.btn-next-question');
  buttonNextQuestion?.addEventListener('click', () => {
    buttonNextQuestion.textContent = 'Я не знаю';
    const currentIndex = getState().indexWord + 1;
    updateState('indexWord', currentIndex);
    clearGameWindow();
    if (currentIndex >= listWords.length) {
      showGameResult(gameState);
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

export function getChoiceOfDifficultyLevel(): HTMLElement {
  const elem = document.createElement('div');
  elem.append(createMenuGame());
  const menuLevels = elem.querySelector('.btn-group');
  menuLevels?.addEventListener('click', startNewGame);
  return elem;
}
