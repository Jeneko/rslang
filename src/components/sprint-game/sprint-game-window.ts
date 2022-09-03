import { Word } from 'types/index';
import { getAuth } from 'utils/auth';
import { sprintState } from './sprint-state';
import statistic from './statistic';
import { CurrentWord, DeleteWord, Points } from './types';
import userWordsUpdate from './user-words-update';

export const renderGame = (randomWords: CurrentWord): string => `
  <div class="points">
    <p class="earned-points">${sprintState.earnedPoints}</p>
    <p class="reword-points">+${sprintState.rewordPoints}</p>
  </div>
  <div class="choose-words">
    <div class="session">🤨</div>
    <p class="english-word">${sprintState.words[randomWords.curWordIdx].word}</p>
    <p class="russian-word">${sprintState.words[randomWords.randomIdx].wordTranslate}</p>
    <div class="choose-buttons" tabindex="-1">
      <button class="btn chooseBtn btn-primary btn-true">True</button>
      <button class="btn chooseBtn btn-primary btn-false">False</button>
    </div>
  </div>
  <div class="timer"><span class="time"></span></div>
`;

export const loadingBar = `
  <div class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
`;

export const chooseWords = (wordsIndexes: number[]): CurrentWord => {
  const firstWordIndex = randomNumber(wordsIndexes.length - 1);
  const secondWordIndex = randomNumber(wordsIndexes.length - 1);
  const randomIndexes = [wordsIndexes[firstWordIndex], wordsIndexes[secondWordIndex]];
  return {
    curWordIdx: wordsIndexes[firstWordIndex],
    randomIdx: randomIndexes[Math.round(Math.random())],
  };
};

const randomNumber = (max: number): number => Math.round(Math.random() * max);

export const subtractShownWordIdx: DeleteWord = (wordsIdx, shownWordIdx) => wordsIdx.filter((i) => i !== shownWordIdx);

export const currentTranslateCheck = (randomWords: CurrentWord, depend: boolean) => {
  const { id } = sprintState.words[randomWords.curWordIdx];
  if (depend) {
    sprintState.earnedPoints += sprintState.rewordPoints;
    sprintState.rightAnswers.push(randomWords.curWordIdx);
    sprintState.session.count += 1;
    sprintState.session.longestRow = sprintState.session.count;
    sessionCounter();
  } else {
    sprintState.wrongAnswers.push(randomWords.curWordIdx);
    setDefaultSession();
  }

  if (getAuth()) {
    userWordsUpdate(id, depend);
  }
};

export const updateGame = (randomWords: CurrentWord, elem: HTMLElement): void => {
  (elem.querySelector('.earned-points') as HTMLElement).innerHTML = sprintState.earnedPoints.toString();
  (elem.querySelector('.reword-points') as HTMLElement).innerHTML = `+${sprintState.rewordPoints}`;
  (elem.querySelector('.english-word') as HTMLElement).innerHTML = sprintState.words[randomWords.curWordIdx].word;
  (elem.querySelector('.russian-word') as HTMLElement).innerHTML = sprintState.words[randomWords.randomIdx].wordTranslate;
};

export const modalResults = (): string => `
  <div class="results">
    <h3 class="result-points">${sprintState.earnedPoints} points</h3>
    <h5>Right answers:</h5>
    <ul class="results__unordered-list">
      ${renderResultList(sprintState.rightAnswers, sprintState.words, 'true')}
    </ul>
    <h5>Wrong answers:</h5>
    <ul class="results__unordered-list">
      ${renderResultList(sprintState.wrongAnswers, sprintState.words, 'false')}
    </ul>
    <button class="results__close-button btn-close"></button>
  </div>
`;

export const timer = (): void => {
  const timeElem = document.querySelector('.time');
  if (timeElem) {
    timeElem.innerHTML = sprintState.timer.toString();
    sprintState.timer -= 1;
    if (sprintState.timer <= 0) {
      (document.querySelector('.sprint') as HTMLElement).innerHTML = modalResults();
      if (getAuth()) {
        statistic();
      }
      return;
    }
    setTimeout(timer, 1000);
  }
};

const sessionCounter = () => {
  sprintState.session.longestRow = sprintState.session.count > sprintState.session.longestRow
    ? sprintState.session.count
    : sprintState.session.longestRow;

  if (sprintState.session.count === 3) {
    sprintState.rewordPoints = Points.medium;
    (document.querySelector('.session') as HTMLElement).textContent = '🙂';
  }
  if (sprintState.session.count >= 6) {
    sprintState.rewordPoints = Points.high;
    (document.querySelector('.session') as HTMLElement).textContent = '😀';
  }
};

const setDefaultSession = () => {
  sprintState.session.count = 0;
  sprintState.rewordPoints = Points.small;
  (document.querySelector('.session') as HTMLElement).textContent = '🤨';
};

const renderResultList = (resultIdx: number[], wordsArr: Word[], bool: 'true' | 'false') => resultIdx
  .map(
    (wordIndex) => `<li class="results__list-${bool}">
  ${wordsArr[wordIndex].word} - ${wordsArr[wordIndex].wordTranslate}
  </li>`,
  )
  .join('');
