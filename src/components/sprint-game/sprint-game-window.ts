import { Word } from 'types/index';
import { Answers, CurrentWord } from './types';

export const points = {
  earnedPoints: 0,
  rewordPoints: 10,
};

export const answers: Answers = {
  rightAnswers: [],
  wrongAnswers: [],
};

export const renderGame = (randomWords: CurrentWord) => `
  <div class="points">
    <p class="earned-points">${points.earnedPoints}</p>
    <p class="reword-points">+${points.rewordPoints}</p>
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

export const chooseWords = (words: Word[]) => {
  const firstWord = words[randomNumber(words.length - 1)];
  const secondWord = words[randomNumber(words.length - 1)];
  const random = [firstWord, secondWord];
  return {
    word: firstWord,
    random: random[Math.round(Math.random())],
  };
};

const randomNumber = (max: number) => Math.floor(Math.random() * max);

export const deleteShownWord = (words: Word[], shownWord: Word) => words.filter((word) => word !== shownWord);

export const isCurrentTranslate = (randomWords: CurrentWord) => {
  if (randomWords.word === randomWords.random) {
    points.earnedPoints += points.rewordPoints;
    answers.rightAnswers.push(randomWords.word);
  } else {
    answers.wrongAnswers.push(randomWords.word);
  }
};

export const isNotCurrentTranslate = (randomWords: CurrentWord) => {
  if (randomWords.word !== randomWords.random) {
    points.earnedPoints += points.rewordPoints;
    answers.rightAnswers.push(randomWords.word);
  } else {
    answers.wrongAnswers.push(randomWords.word);
  }
};

export const updateGame = (randomWords: CurrentWord) => {
  (document.querySelector('.earned-points') as HTMLElement).innerHTML = points.earnedPoints.toString();
  (document.querySelector('.english-word') as HTMLElement).innerHTML = randomWords.word.word;
  (document.querySelector('.russian-word') as HTMLElement).innerHTML = randomWords.random.wordTranslate;
};

const modalResults = () => `
<div class="results">
  <h3 class="result-points">${points.earnedPoints} points</h3>
  <h5>Right answers:</h5>
  <ul class="results__unordered-list">
     ${answers.rightAnswers
    .map((word) => `<li class="results__list-true">${word.word} - ${word.wordTranslate}</li>`)
    .join('')}
  </ul>
  <h5>Wrong answers:</h5>
  <ul class="results__unordered-list">
     ${answers.wrongAnswers
    .map((word) => `<li class="results__list-false">${word.word} - ${word.wordTranslate}</li>`)
    .join('')}
  </ul>
  <button class="results__close-button btn-close"></button>
</div>

`;

let seconds: number = 60;
export const timer = () => {
  (document.querySelector('.time') as HTMLElement).innerHTML = seconds.toString();
  seconds -= 1;
  if (seconds <= 0) {
    (document.querySelector('.sprint') as HTMLElement).innerHTML = modalResults();
    seconds = 60;
  } else {
    setTimeout(timer, 1000);
  }
};

export const loadingBar = () => `
<div class="d-flex justify-content-center">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>
`;
