import { Word } from '../../../../../../types/index';
import addEventsForAudioButton from '../addEventsForAudioButton/addEventsForAudioButton';
import getRandomWords from './getRandomWords/getRandomWords';
import addEventsForChoiceButtons from '../addEventsForChoiceButtons/addEventsForChoiceButtons';
import addEventsForNextQuestionButton from '../addEventsForNextQuestionButton/addEventsForNextQuestionButton';

export default async function generateWindowGame(currentWord: Word, arrayWords: Word[], numberPage: number) {
  const windowGame = document.createElement('div');

  const {
    audio, word,
  } = currentWord;
  const listRandomWords = getRandomWords(word, arrayWords);
  console.log(listRandomWords);
  windowGame.innerHTML = `
    <div class="container text-center">
      <div class="row">
        <div class="col current-word">
        <button id="playAudio" type="button" class="btn btn-dark">Audio</button>
        </div>
      </div>
      <div class="row">
      <div class="col">
        <button type="button" class="btn btn-light btn-choice-of-answer">${listRandomWords[0]}</button>
      </div>
      <div class="col">
        <button type="button" class="btn btn-light btn-choice-of-answer">${listRandomWords[1]}</button>
      </div>
      <div class="col">
        <button type="button" class="btn btn-light btn-choice-of-answer">${listRandomWords[2]}</button>
      </div>
      <div class="col">
        <button type="button" class="btn btn-light btn-choice-of-answer">${listRandomWords[3]}</button>
      </div>
      <div class="col">
        <button type="button" class="btn btn-light btn-choice-of-answer">${listRandomWords[4]}</button>
      </div>
      <button type="button" class="btn btn-primary btn-next-question btn--hidden">Next</button>
    </div>
  `;
  console.log(windowGame);
  windowGame.classList.add('game-window', 'game-window--hidden');
  document.body.append(windowGame);
  const buttonAudio = document.getElementById('playAudio');
  addEventsForAudioButton(buttonAudio as HTMLElement, audio);
  addEventsForChoiceButtons(word);
  addEventsForNextQuestionButton(0, numberPage, arrayWords);
}
