import { Word } from 'types/index';
import { renderModal, generateWords } from './modal-lvl';
import {
  answers,
  chooseWords,
  deleteShownWord,
  isCurrentTranslate,
  isNotCurrentTranslate,
  loadingBar,
  points,
  renderGame,
  timer,
  updateGame,
} from './sprint-game-window';
import { CurrentWord } from './types';

export default function getSprintGame() {
  const elem = document.createElement('div');
  elem.className = 'sprint-game';
  elem.innerHTML = renderModal();
  sprintHandler(elem);
  return elem;
}

export const sprintHandler = (elem: HTMLElement) => {
  let words: Word[];
  let randomWords: CurrentWord;

  elem?.addEventListener('click', async (event: MouseEvent) => {
    const { classList } = event.target as Element;
    const gameWindow = document.querySelector('.sprint') as HTMLElement;

    if (classList.contains('btn-lvl')) {
      gameWindow.innerHTML = loadingBar();
      const { id } = event.target as HTMLButtonElement;
      const lvl = Number(id.split('-')[1]);
      words = await generateWords(lvl);
      randomWords = chooseWords(words);
      gameWindow.innerHTML = renderGame(randomWords);
      timer();
      answers.rightAnswers = [];
      answers.wrongAnswers = [];
      points.earnedPoints = 0;
    }
    if (classList.contains('chooseBtn')) {
      if (classList.contains('btn-true')) {
        isCurrentTranslate(randomWords);
      } else {
        isNotCurrentTranslate(randomWords);
      }
      words = deleteShownWord(words, randomWords.word);
      randomWords = chooseWords(words);
      updateGame(randomWords);
    }
    if (classList.contains('close-results')) {
      (document.querySelector('.sprint-game') as HTMLElement).innerHTML = renderModal();
    }
  });
};
