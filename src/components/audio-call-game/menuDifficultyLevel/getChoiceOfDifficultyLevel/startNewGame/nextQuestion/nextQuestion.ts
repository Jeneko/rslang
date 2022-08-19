import { Word } from '../../../../../../types/index';
import addEventsForAudioButton from '../addEventsForAudioButton/addEventsForAudioButton';
import getRandomWords from '../generateWindowGame/getRandomWords/getRandomWords';
import addEventsForChoiceButtons from '../addEventsForChoiceButtons/addEventsForChoiceButtons';
import playAudio from '../playAudio/playAudio';
import { getImage } from '../../../../../../API/index';

export default async function nextQuestion(currentWord: Word, arrayWords: Word[], numberPage: number) {
  const windowGame = document.querySelector('.game-window');
  console.log(numberPage);
  const {
    audio, word, image, transcription, wordTranslate,
  } = currentWord;
  const imageResponse = await getImage(image);
  console.log(imageResponse);
  const listRandomWords = getRandomWords(word, arrayWords);
  console.log(listRandomWords);
  (windowGame as HTMLElement).innerHTML = `
    <div class="container text-center">
      <div class="row">
        <div class="col current-word">
          <button id="playAudio" type="button" class="btn btn-dark">Audio</button>
          <div class="card current-word-info current-word-info--hidden" style="width: 18rem;">
            <img src="${imageResponse}" class="card-img-top" alt="Word">
            <div class="card-body">
              <p class="card-text">${word}, (${transcription}), ${wordTranslate}</p>
            </div>
          </div>
          </div>
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
  playAudio(null, audio);
  const buttonAudio = document.getElementById('playAudio');
  addEventsForAudioButton(buttonAudio as HTMLElement, audio);
  addEventsForChoiceButtons(word);
}
