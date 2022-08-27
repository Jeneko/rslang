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

export async function startNewGame(event: Event | null, startPage: HTMLElement | undefined): Promise<void> {
  if (event) {
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

    const windowGameBlock = document.querySelector('.audio-call-game') as HTMLElement;
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
        addEventsForNextQuestionButton(windowGameBlock, listWords, state);
      }
    }
  } else {
    let buttonsWrapper = document.querySelector('.button-wrapper-audiocall');
    if (buttonsWrapper) {
      buttonsWrapper.remove();
    } else {
      buttonsWrapper = document.createElement('div');
      buttonsWrapper.classList.add('.button-wrapper-audiocall');
    }
    const currentPage = getState().studyBookPage;
    const currentChapter = getState().studyBookChapter;
    if (buttonsWrapper) {
      buttonsWrapper?.remove();
    }
    const blockButtonNextQuestion = document.createElement('div');
    blockButtonNextQuestion.classList.add('button-wrapper-audiocall');
    blockButtonNextQuestion.innerHTML = `
    <button type="button" class="btn btn-primary btn-next-question btn--hidden">I do not know</button>
    `;

    const windowGameBlock = startPage?.querySelector('.audio-call-game') as HTMLElement;
    const state: GameState = {
      correctAnswers: [],
      wrongAnswers: [],
      currentLevel: +currentPage,
    };
    controlGameWindow();
    updateState('indexWord', 0);
    const listWords = await getWords(currentChapter, currentPage);
    await generateWindowGame(listWords[0], listWords, state);
    windowGameBlock?.append(blockButtonNextQuestion);
    addEventsForNextQuestionButton(windowGameBlock, listWords, state);
    console.log(windowGameBlock);
  }
}

export function addEventsForNextQuestionButton(windowGameBlock: HTMLElement, listWords: Word[], gameState: GameState) {
  const buttonNextQuestion = windowGameBlock.querySelector('.btn-next-question') as HTMLElement;
  console.log(buttonNextQuestion, 'button next');
  buttonNextQuestion.setAttribute('wordchosen', 'false');
  buttonNextQuestion?.addEventListener('click', (e: Event) => {
    checkNextQuestion(e, buttonNextQuestion, listWords, gameState);
  });
  buttonNextQuestion.addEventListener('checkNextQuestion', (e) => {
    checkNextQuestion(e, buttonNextQuestion, listWords, gameState);
  });
}

export function clearGameWindow(): void {
  const gameWindow = document.querySelector('.game-window');
  while (gameWindow?.firstChild) {
    gameWindow.firstChild.remove();
  }
}

export function getNewWindowGame(): HTMLElement {
  const previousPage = getState().page;
  const menu = document.querySelector('.audio-call-page') as HTMLElement || document.createElement('div') as HTMLElement;
  if (previousPage === 'study-book') {
    menu.append(createMenuGame(true));
    startNewGame(null, menu);
  } else {
    console.log('no-auth');
    menu.append(createMenuGame(false));
    const menuLevels = menu.querySelector('.btn-wrapper');
    menuLevels?.addEventListener('click', (e: Event) => startNewGame(e, undefined));
  }
  console.log(menu);
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
    getNewWindowGame();
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

export async function checkNextQuestion(e: Event, buttonNextQuestion: HTMLElement, listWords: Word[], gameState: GameState) {
  console.log('event work');
  buttonNextQuestion.textContent = 'I do not know';
  const currentIndex = getState().indexWord + 1;
  if (currentIndex >= listWords.length) {
    clearGameWindow();
    const modalGameResult = getModalResultGame(gameState);
    playAgainButtonClickHandler(modalGameResult);
    showResult(modalGameResult, gameState);
    updateState('indexWord', currentIndex);
  } else if (buttonNextQuestion.getAttribute('wordchosen') === 'false') {
    hiddenAllButtons();
    showCurrentWordInfo();
    buttonNextQuestion.textContent = 'Next question';
    buttonNextQuestion.setAttribute('wordchosen', 'true');
    const wordId = (document.querySelector('.current-word-info') as HTMLElement).dataset.id as string;
    const word = await getWord(wordId as string);
    gameState.wrongAnswers.push(word);
  } else {
    buttonNextQuestion.setAttribute('wordchosen', 'false');
    clearGameWindow();
    generateWindowGame(listWords[currentIndex], listWords, gameState);
    updateState('indexWord', currentIndex);
  }
}
