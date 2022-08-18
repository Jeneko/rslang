import { Word } from '../../../../../../types/index';
import addEventsForAudioButton from '../addEventsForAudioButton/addEventsForAudioButton';
import getRandomWords from '../generateWindowGame/getRandomWords/getRandomWords';
import addEventsForChoiceButtons from '../addEventsForChoiceButtons/addEventsForChoiceButtons';

export default async function nextQuestion(currentWord: Word, arrayWords: Word[], numberPage: number) {
  const windowGame = document.createElement('div');
  console.log(numberPage);
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
    </div>
  `;
  console.log(windowGame);
  windowGame.classList.add('game-window', 'game-window--hidden');
  document.body.append(windowGame);
  const buttonAudio = document.getElementById('playAudio');
  addEventsForAudioButton(buttonAudio as HTMLElement, audio);
  addEventsForChoiceButtons(word);
}
