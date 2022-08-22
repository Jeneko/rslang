import controlGameWindow from '../../controlGameWindow/controlGameWindow';
import { getWords } from '../../../../../API/index';
import generateWindowGame from './generateWindowGame/generateWindowGame';
import { updateState, getState } from '../../../../../utils/state';
import { GameState } from './game.types';
import { Word } from '../../../../../types/index';

export default async function startNewGame(event: Event) {
  if (document.querySelector('.button-wrapper')) {
    (document.querySelector('.button-wrapper') as HTMLElement).remove();
  }
  const blockButtonNextQuestion = document.createElement('div');
  blockButtonNextQuestion.classList.add('button-wrapper');
  blockButtonNextQuestion.innerHTML = `
  <button type="button" class="btn btn-primary btn-next-question btn--hidden">Я не знаю</button>
  `;
  const windowGameBlock = document.querySelector('.audio-call-game');
  console.log(windowGameBlock, blockButtonNextQuestion);
  const { target } = event;
  const state: GameState = {
    correctAnswers: [],
    wrongAnswers: [],
    currentLevel: (target as HTMLElement).dataset.level as string,
  };
  if ((target as HTMLElement).classList.contains('btn-check') || (target as HTMLElement).classList.contains('btn-play-again')) {
    const currentLevel = ((target as HTMLElement).dataset.level);
    controlGameWindow(true);
    if (currentLevel) {
      const randomPage = Math.trunc(Math.random() * 30);
      updateState('indexWord', 0);
      const listWords = await getWords(+currentLevel, randomPage);
      console.log(listWords);
      await generateWindowGame(listWords[0], listWords, state);
      windowGameBlock?.append(blockButtonNextQuestion);
      addEventsForNextQuestionButton(randomPage, listWords, state);
    }
  }
}

export function showGameResult(gameState: GameState) {
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
  buttonPlayAgain?.addEventListener('click', startNewGame);
  const blockListCorrect = modalResultGame.querySelector('.list-group-correct');
  const blockListWrong = modalResultGame.querySelector('.list-group-wrong');
  const { correctAnswers, wrongAnswers } = gameState;
  correctAnswers.forEach((el) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.innerHTML = `\u2713 ${el.word} | ${el.wordTranslate}`;
    blockListCorrect?.append(listItem);
  });
  wrongAnswers.forEach((el) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.innerHTML = `\u2716 ${el.word} | ${el.wordTranslate}`;
    blockListWrong?.append(listItem);
  });
  buttonNextQuestion?.remove();
  parentModal?.append(modalResultGame);
}

export function addEventsForNextQuestionButton(numberPage: number, listWords: Word[], gameState: GameState) {
  const buttonNextQuestion = document.querySelector('.btn-next-question');
  buttonNextQuestion?.addEventListener('click', () => {
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

export function clearGameWindow() {
  const gameWindow = document.querySelector('.game-window');
  while (gameWindow?.firstChild) {
    gameWindow.firstChild.remove();
  }
}
