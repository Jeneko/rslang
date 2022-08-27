import { SOURCE } from 'API/index';
import { Word } from 'types/index';
import imageAudio from 'assets/speaker-icon.svg';
import getRandomWords from './getRandomWords/getRandomWords';
import addEventsForChoiceButtons, { addEventsForKeyboard } from '../addEventsForChoiceButtons/addEventsForChoiceButtons';
import playAudio from '../playAudio/playAudio';
import { GameState } from '../game.types';

export default async function generateWindowGame(currentWord: Word, arrayWords: Word[], gameState: GameState): Promise<void> {
  const windowGame = document.querySelector('.game-window') as HTMLElement;

  const {
    audio, word, image, transcription, wordTranslate, id,
  } = currentWord;
  const imageResponse = `${SOURCE}/${image}`;
  const listRandomWords = getRandomWords(currentWord, arrayWords);
  windowGame.innerHTML = `
    <div class="container text-center">
      <div class="row">
        <div class="col current-word">
          <button id="playAudio" type="button" class="btn button-audio">
            <img class="audiocall-speaker-image" src="${imageAudio}" alt="speaker">
          </button>
          <div data-id=${id} class="card current-word-info current-word-info--hidden">
            <img src="${imageResponse}" class="card-img-top" alt="Word">
            <div class="card-body">
              <p class="card-text">${word}, (${transcription}), ${wordTranslate}</p>
            </div>
          </div>
        </div>
      </div>
      <div tabindex="-1" class="row row-buttons-choice-wrapper">
      <div class="col">
        <button  type="button" data-id="${listRandomWords[0][1]}" class="btn btn-light btn-choice-of-answer">${listRandomWords[0][0]}</button>
      </div>
      <div class="col">
        <button type="button" data-id="${listRandomWords[1][1]}" class="btn btn-light btn-choice-of-answer">${listRandomWords[1][0]}</button>
      </div>
      <div class="col">
        <button type="button" data-id="${listRandomWords[2][1]}" class="btn btn-light btn-choice-of-answer">${listRandomWords[2][0]}</button>
      </div>
      <div class="col">
        <button type="button" data-id="${listRandomWords[3][1]}" class="btn btn-light btn-choice-of-answer">${listRandomWords[3][0]}</button>
      </div>
      <div class="col">
        <button type="button" data-id="${listRandomWords[4][1]}" class="btn btn-light btn-choice-of-answer">${listRandomWords[4][0]}</button>
      </div>
    </div>
  `;
  await playAudio(audio);
  const buttonAudio = document.getElementById('playAudio');
  buttonAudio?.addEventListener('click', () => playAudio(audio));
  addEventsForChoiceButtons(wordTranslate, gameState, currentWord);
  addEventsForKeyboard(wordTranslate, gameState, currentWord);
}
