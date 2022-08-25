import { sprintState } from './sprint-state';
import { CurrentWord } from './types';

export const renderGame = (randomWords: CurrentWord): string => `
  <div class="points">
    <p class="earned-points">${sprintState.earnedPoints}</p>
    <p class="reword-points">+${sprintState.rewordPoints}</p>
  </div>
  <div class="choose-words">
    <div class="session">🤨</div>
    <p class="english-word">${sprintState.words[randomWords.word].word}</p>
    <p class="russian-word">${sprintState.words[randomWords.random].wordTranslate}</p>
    <div class="choose-buttons">
      <button class="btn chooseBtn btn-primary btn-true" >True</button>
      <button class="btn chooseBtn btn-primary btn-false" >False</button>
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
  const random = [wordsIndexes[firstWordIndex], wordsIndexes[secondWordIndex]];
  return {
    word: wordsIndexes[firstWordIndex],
    random: random[Math.round(Math.random())],
  };
};

const randomNumber = (max: number): number => Math.round(Math.random() * max);

export const deleteShownWord = (wordsInd: number[], shownWord: number): number[] => wordsInd.filter((i) => i !== shownWord);

export const isCurrentTranslate = (randomWords: CurrentWord, depend: boolean): void => {
  if (depend) {
    sprintState.earnedPoints += sprintState.rewordPoints;
    sprintState.rightAnswers.push(randomWords.word);
    sprintState.session.count += 1;
    sessionCounter();
  } else {
    sprintState.wrongAnswers.push(randomWords.word);
    sprintState.session.session = sprintState.session.count > sprintState.session.session ? sprintState.session.count : sprintState.session.session;
    sprintState.session.count = 0;
    sessionCounter();
  }
};

export const updateGame = (randomWords: CurrentWord, elem: HTMLElement): void => {
  (elem.querySelector('.earned-points') as HTMLElement).innerHTML = sprintState.earnedPoints.toString();
  (elem.querySelector('.reword-points') as HTMLElement).innerHTML = `+${sprintState.rewordPoints}`;
  (elem.querySelector('.english-word') as HTMLElement).innerHTML = sprintState.words[randomWords.word].word;
  (elem.querySelector('.russian-word') as HTMLElement).innerHTML = sprintState.words[randomWords.random].wordTranslate;
};

export const modalResults = (): string => `
<div class="results">
  <h3 class="result-points">${sprintState.earnedPoints} points</h3>
  <h5>Right answers:</h5>
  <ul class="results__unordered-list">
  ${sprintState.rightAnswers
    .map(
      (wordIndex) => `<li class="results__list-true">${sprintState.words[wordIndex].word} - ${sprintState.words[wordIndex].wordTranslate}</li>`,
    )
    .join('')}
  </ul>
  <h5>Wrong answers:</h5>
  <ul class="results__unordered-list">
  ${sprintState.wrongAnswers
    .map(
      (wordIndex) => `<li class="results__list-false">${sprintState.words[wordIndex].word} - ${sprintState.words[wordIndex].wordTranslate}</li>`,
    )
    .join('')}
  </ul>
  <button class="results__close-button btn-close"></button>
</div>

`;

export const timer = (): void => {
  if (document.querySelector('.time')) {
    (document.querySelector('.time') as HTMLElement).innerHTML = sprintState.timer.toString();
    sprintState.timer -= 1;
    if (sprintState.timer <= 0) {
      (document.querySelector('.sprint') as HTMLElement).innerHTML = modalResults();
    } else {
      setTimeout(timer, 1000);
    }
  }
};

const sessionCounter = () => {
  if (sprintState.session.count < 3) {
    sprintState.rewordPoints = 10;
    (document.querySelector('.session') as HTMLElement).textContent = '🤨';
  }
  if (sprintState.session.count >= 3 && sprintState.session.count < 6) {
    sprintState.rewordPoints = 20;
    (document.querySelector('.session') as HTMLElement).textContent = '🙂';
  }
  if (sprintState.session.count >= 6) {
    sprintState.rewordPoints = 40;
    (document.querySelector('.session') as HTMLElement).textContent = '😀';
  }
};
