import { Word } from 'types/index';
import { sprintState } from './sprint-state';
import { CurrentWord } from './types';

export const renderGame = (randomWords: CurrentWord): string => `
  <div class="points">
    <p class="earned-points">${sprintState.earnedPoints}</p>
    <p class="reword-points">+${sprintState.rewordPoints}</p>
  </div>
  <div class="choose-words">
    <p class="english-word">${randomWords.word.word}</p>
    <p class="russian-word">${randomWords.random.wordTranslate}</p>
    <div class="choose-buttons">
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

export const chooseWords = (words: Word[]): CurrentWord => {
  const firstWord = words[randomNumber(words.length - 1)];
  const secondWord = words[randomNumber(words.length - 1)];
  const random = [firstWord, secondWord];
  return {
    word: firstWord,
    random: random[Math.round(Math.random())],
  };
};

const randomNumber = (max: number): number => Math.round(Math.random() * max);

export const deleteShownWord = (words: Word[], shownWord: Word): Word[] => words.filter((word) => word !== shownWord);

export const isCurrentTranslate = (randomWords: CurrentWord, depend: boolean): void => {
  if (depend) {
    sprintState.earnedPoints += sprintState.rewordPoints;
    sprintState.rightAnswers.push(randomWords.word);
  } else {
    sprintState.wrongAnswers.push(randomWords.word);
  }
};

export const updateGame = (randomWords: CurrentWord, elem: HTMLElement): void => {
  (elem.querySelector('.earned-points') as HTMLElement).innerHTML = sprintState.earnedPoints.toString();
  (elem.querySelector('.english-word') as HTMLElement).innerHTML = randomWords.word.word;
  (elem.querySelector('.russian-word') as HTMLElement).innerHTML = randomWords.random.wordTranslate;
};

const modalResults = (): string => `
<div class="results">
  <h3 class="result-points">${sprintState.earnedPoints} points</h3>
  <h5>Right answers:</h5>
  <ul class="results__unordered-list">
  ${sprintState.rightAnswers
    .map((word) => `<li class="results__list-true">${word.word} - ${word.wordTranslate}</li>`)
    .join('')}
  </ul>
  <h5>Wrong answers:</h5>
  <ul class="results__unordered-list">
  ${sprintState.wrongAnswers
    .map((word) => `<li class="results__list-false">${word.word} - ${word.wordTranslate}</li>`)
    .join('')}
  </ul>
  <button class="results__close-button btn-close"></button>
</div>

`;

export const timer = (): void => {
  (document.querySelector('.time') as HTMLElement).innerHTML = sprintState.seconds.toString();
  sprintState.seconds -= 1;
  if (sprintState.seconds <= 0) {
    (document.querySelector('.sprint') as HTMLElement).innerHTML = modalResults();
  } else {
    setTimeout(timer, 1000);
  }
};
