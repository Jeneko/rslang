import {
  getWords, getWord, getAggregatedWords, getUserStatistic, updateUserStatistic, updateUserWord,
} from 'API/index';
import { updateState, getState } from 'utils/state';
import {
  Word, WordWithUserWord, GameStatistic, WordStatus, WordsStatistic,
} from 'types/index';
import { GameState } from 'game.types';
import controlGameWindow from 'components/audio-call-game/menuDifficultyLevel/controlGameWindow/controlGameWindow';
import createMenuGame from 'components/audio-call-game/createMenuGame';
import { getAllUserWordsWithData, setWordOptional } from 'utils/user-words';
import { getAuth } from 'utils/auth';
import audioImage from 'assets/speaker-icon.svg';
import getTodayStat from 'utils/statistic';
import generateWindowGame from './generateWindowGame/generateWindowGame';
import showCurrentWordInfo from './addEventsForChoiceButtons/showCurrentWordInfo/showCurrentWordInfo';
import hiddenAllButtons from './addEventsForChoiceButtons/disableAllButtonsChoice/disableAllButtonsChoice';
import playAudio from './playAudio/playAudio';

const MAX_PAGE_NUM = 30;

export async function startNewGame(event: Event | null, startPage: HTMLElement | undefined): Promise<void> {
  if (event) {
    const spinner = getSpinner();
    document.body.append(spinner);
    const statusAuth = getAuth();
    if (!statusAuth && +((event.target as HTMLElement).dataset.level as string) === 6) {
      if (document.querySelector('.info-no-auth')) {
        return;
      }
      const modalInfo = document.createElement('div');
      modalInfo.innerHTML = `
        <p>
          Chapter 7 contains the most difficult words user selected manually. Please, Login or Register to start using this chapter.
        </p>
      `;
      modalInfo.classList.add('container', 'info-no-auth');
      document.body.append(modalInfo);
      return;
    }
    if (document.querySelector('.info-no-auth')) {
      document.querySelector('.info-no-auth')?.remove();
    }
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
      counterStreakForGame: 0,
      longestStreakForGame: 0,
      newWords: 0,
    };
    if (buttonCheck.classList.contains('btn-select-level') || buttonCheck.classList.contains('btn-play-again')) {
      const currentLevel = (buttonCheck.dataset.level);
      controlGameWindow();
      if (currentLevel) {
        const randomPage = Math.trunc(Math.random() * MAX_PAGE_NUM);
        updateState('indexWord', 0);
        let listWords;
        if (getAuth()) {
          listWords = getAuth() && +currentLevel !== 6 ? await getAuthWords(+currentLevel, randomPage) : await getAllUserWordsWithData();
          state.newWords = await checkNewWords(listWords as WordWithUserWord[]);
        } else {
          listWords = await getWords(+currentLevel, randomPage);
        }

        if (listWords.length === 0) {
          if (document.querySelector('.info-no-auth')) {
            return;
          }
          const modalInfo = document.createElement('div');
          modalInfo.innerHTML = `
            <p>
              You do not have hard words! Learn more in the  <a class="load-page-link" href="#study-book">study book</a>!
            </p>
          `;
          modalInfo.classList.add('container', 'info-empty-hard-words');
          document.body.append(modalInfo);
          return;
        }
        await generateWindowGame(listWords[0], listWords, state);
        windowGameBlock?.append(blockButtonNextQuestion);
        addEventsForNextQuestionButton(windowGameBlock, listWords, state);
        spinner.remove();
      }
    }
  } else {
    const spinner = getSpinner();
    document.body.append(spinner);
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
      counterStreakForGame: 0,
      longestStreakForGame: 0,
      newWords: 0,
    };
    controlGameWindow();
    updateState('indexWord', 0);
    let listWords;

    if (currentChapter === 6 && getAuth()) {
      listWords = await getAllUserWordsWithData();
      checkNewWords(listWords);
    } else if (getAuth()) {
      listWords = await getAuthWords(currentChapter, currentPage);
    } else {
      listWords = await getWords(currentChapter, currentPage);
    }

    state.newWords = await checkNewWords(listWords as WordWithUserWord[]);
    await generateWindowGame(listWords[0], listWords, state);
    windowGameBlock?.append(blockButtonNextQuestion);
    addEventsForNextQuestionButton(windowGameBlock, listWords, state);
    spinner.remove();
  }
}

export function addEventsForNextQuestionButton(windowGameBlock: HTMLElement, listWords: Word[], gameState: GameState) {
  const buttonNextQuestion = windowGameBlock.querySelector('.btn-next-question') as HTMLElement;
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
    menu.append(createMenuGame(false));
    const menuLevels = menu.querySelector('.btn-wrapper');
    menuLevels?.addEventListener('click', (e: Event) => startNewGame(e, undefined));
  }
  return menu;
}

function getAllAnswersForGame(list: Word[], blockList: HTMLElement) {
  const fragment = document.createDocumentFragment();
  list.forEach((el) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.innerHTML = `<button class="button-audio-result"><img class="button-audio-image" src="${audioImage}"></button> ${el.word} | ${el.wordTranslate}`;
    const buttonAudio = listItem.querySelector('.button-audio-result');
    buttonAudio?.addEventListener('click', () => {
      playAudio(el.audio);
    });
    fragment.append(listItem);
  });
  blockList.append(fragment);
}

function getModalResultGame(gameState: GameState) {
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

  if (getAuth()) {
    sendDataToServer(correctAnswers as WordWithUserWord[], wrongAnswers as WordWithUserWord[], gameState);
  }

  getAllAnswersForGame(correctAnswers, blockListCorrect);
  getAllAnswersForGame(wrongAnswers, blockListWrong);

  buttonNextQuestion?.remove();
  parentModal?.append(modalResultGame);
}

export async function checkNextQuestion(e: Event, buttonNextQuestion: HTMLElement, listWords: Word[], gameState: GameState) {
  const currentIndex = getState().indexWord + 1;
  if (currentIndex >= listWords.length && buttonNextQuestion.textContent !== 'I do not know') {
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
    buttonNextQuestion.textContent = 'I do not know';
    buttonNextQuestion.setAttribute('wordchosen', 'false');
    clearGameWindow();
    generateWindowGame(listWords[currentIndex], listWords, gameState);
    updateState('indexWord', currentIndex);
  }
}

async function getAuthWords(currentLevel: string | number, currentPage: string | number): Promise<Word[]> {
  const words: Word[] = [];
  async function getMoreWords(level: number, page: number) {
    const filter = `{"$and":[{"userWord.difficulty": {"$not": {"$eq": "learned"}}},{"page":${level}},{"group": ${page}}]}`;
    const resp = await getAggregatedWords(filter, 20);
    let result = resp[0].paginatedResults;
    if (words.length + result.length > 20) {
      const length = words.length + result.length - 20;
      result = result.splice(length);
    }
    words.push(...result);
    if (page === 0) {
      return;
    }
    if (words.length < 20) {
      await getMoreWords(level, page - 1);
    }
  }
  await getMoreWords(+currentLevel, +currentPage);
  return words.flat();
}

async function checkNewWords(array: WordWithUserWord[]) {
  let acc = 0;
  const promiseArray = [];
  for (let i = 0; i < array.length; i += 1) {
    const el = array[i];
    if (el.userWord) {
      if (!el.userWord.optional.guessedWrong && !el.userWord.optional.guessedRight) {
        acc += 1;
      }
    } else {
      const defaultOptional = {
        guessedInRow: 0,
        guessedRight: 0,
        guessedWrong: 0,
      };
      acc += 1;
      promiseArray.push(setWordOptional(el._id as string, defaultOptional));
    }
  }
  await Promise.all(promiseArray);
  return acc;
}

async function sendDataToServer(correctAnswersList: WordWithUserWord[], wrongAnswersList: WordWithUserWord[], gameState: GameState) {
  const userStatistics = await getUserStatistic();
  const gameStatistics = getTodayStat<GameStatistic>(userStatistics, 'audiocall');
  const wordStatistics = getTodayStat<WordsStatistic>(userStatistics, 'words');
  correctAnswersList.forEach((el) => {
    const optionals = {
      difficulty: el.userWord ? el.userWord.difficulty : WordStatus.default,
      optional: {
        guessedRight: el.userWord ? el.userWord.optional.guessedRight + 1 : 1,
        guessedWrong: el.userWord ? el.userWord.optional.guessedWrong : 0,
        guessedInRow: el.userWord ? el.userWord.optional.guessedInRow + 1 : 1,
      },
    };
    if (optionals.optional.guessedInRow >= 3 && optionals.difficulty !== WordStatus.learned) {
      optionals.difficulty = WordStatus.learned;
      wordStatistics.learnedWordsQty += 1;
    }
    updateUserWord(el._id as string, optionals);
  });
  wrongAnswersList.forEach((el) => {
    const optionals = {
      difficulty: el.userWord ? el.userWord.difficulty : WordStatus.default,
      optional: {
        guessedRight: el.userWord ? el.userWord.optional.guessedRight + 1 : 1,
        guessedWrong: el.userWord ? el.userWord.optional.guessedWrong + 1 : 1,
        guessedInRow: 0,
      },
    };
    if (optionals.difficulty === WordStatus.learned) {
      optionals.difficulty = WordStatus.default;
      wordStatistics.learnedWordsQty -= 1;
    }
    updateUserWord(el._id as string, optionals);
  });
  gameStatistics.newWordsQty += gameState.newWords;
  gameStatistics.longestRow = gameStatistics.longestRow < gameState.longestStreakForGame ? gameState.longestStreakForGame : gameStatistics.longestRow;
  gameStatistics.rightAnswers += correctAnswersList.length;
  wordStatistics.newWordsQty += gameState.newWords;
  wordStatistics.rightAnswers += correctAnswersList.length;
  await updateUserStatistic(userStatistics);
}

function getSpinner() {
  const spinner = document.createElement('div');
  spinner.classList.add('spinner-audiocall');
  spinner.innerHTML = `
  <button class="btn btn-primary" type="button" disabled>
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Loading...
  </button>
  `;
  return spinner;
}
