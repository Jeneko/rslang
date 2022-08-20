import { Word } from 'types/index';

export const points = {
  earnedPoints: 0,
  rewordPoints: 10,
};

const currentWord: CurrentWord = {
  word: {
    id: '',
    group: 0,
    page: 0,
    word: '',
    image: '',
    audio: '',
    audioMeaning: '',
    audioExample: '',
    textMeaning: '',
    textExample: '',
    transcription: '',
    wordTranslate: '',
    textMeaningTranslate: '',
    textExampleTranslate: '',
  },
  random: {
    id: '',
    group: 0,
    page: 0,
    word: '',
    image: '',
    audio: '',
    audioMeaning: '',
    audioExample: '',
    textMeaning: '',
    textExample: '',
    transcription: '',
    wordTranslate: '',
    textMeaningTranslate: '',
    textExampleTranslate: '',
  },
};

type CurrentWord = {
  word: Word;
  random: Word;
};

export const rightAnswers: Word[] = [];
export const wrongAnswers: Word[] = [];

export const renderGame = () => `
  <div class="points">
    <p class="earned-points">${points.earnedPoints}</p>
    <p class="reword-points">+${points.rewordPoints}</p>
  </div>
  <div class="choose-words">
    <p class="english-word">${currentWord.word.word}</p>
    <p class="russian-word">${currentWord.random.wordTranslate}</p>
    <div class="choose-buttons">
      <button class="btn btn-true">True</button>
      <button class="btn btn-false">False</button>
    </div>
  </div>
  <div class="timer"><span class="time"></span></div>
`;

export const chooseWords = (words: Word[]) => {
  const firstWord = words[randomNumber(words.length - 1)];
  const secondWord = words[randomNumber(words.length - 1)];
  const random = [firstWord, secondWord];
  currentWord.word = firstWord;
  currentWord.random = random[Math.round(Math.random())];
};

const randomNumber = (max: number) => Math.floor(Math.random() * max);

export const isCurrentTranslate = () => {
  if (currentWord.word === currentWord.random) {
    points.earnedPoints += points.rewordPoints;
    rightAnswers.push(currentWord.word);
  }
};

export const isNotCurrentTranslate = () => {
  if (currentWord.word !== currentWord.random) {
    points.earnedPoints += points.rewordPoints;
    wrongAnswers.push(currentWord.word);
  }
};

const modalResults = () => `
<div class="results">
  <h3>${points} points</h3>
  <h5>Right answers:</h5>
  <ol>
     ${rightAnswers.map((word) => `<li>${word.word} - ${word.wordTranslate}</li>`).join('')}
  </ol>
  <h5>Wrong answers:</h5>
  <ol>
     ${wrongAnswers.map((word) => `<li>${word.word} - ${word.wordTranslate}</li>`).join('')}
  </ol>
</div>
`;

export const timer = (gameWindow: HTMLElement) => {
  let seconds: number = 60;
  (document.querySelector('.time') as HTMLElement).innerHTML = seconds.toString();
  seconds -= 1;
  if (seconds <= 0) {
    gameWindow.innerHTML = modalResults();
  } else {
    setTimeout(timer, 1000);
  }
};
