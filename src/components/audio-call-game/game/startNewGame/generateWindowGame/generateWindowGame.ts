import { SOURCE } from 'API/index';
import { Word, WordWithUserWord } from 'types/index';
import imageAudio from 'assets/speaker-icon.svg';
import getRandomWords from './getRandomWords/getRandomWords';
import addEventsForChoiceButtons, { addEventsForKeyboard } from '../addEventsForChoiceButtons/addEventsForChoiceButtons';
import playAudio from '../playAudio/playAudio';
import { GameState } from '../game.types';

export default async function generateWindowGame(currentWord: Word | WordWithUserWord, arrayWords: Word[], gameState: GameState): Promise<void> {
  const windowGame = document.querySelector('.game-window') as HTMLElement;

  const {
    audio, word, image, transcription, wordTranslate,
  } = currentWord;
  const id = currentWord.id ? currentWord.id : (currentWord as WordWithUserWord)._id;
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
      </div>
    </div>
  `;
  const fragmentButton = document.createDocumentFragment();
  const buttonsWrapper = windowGame.querySelector('.row-buttons-choice-wrapper');
  listRandomWords.forEach((el) => {
    const answerVariant = document.createElement('div');
    answerVariant.classList.add('col');
    answerVariant.innerHTML = `
        <button  type="button" data-id="${el[1]}" class="btn btn-light btn-choice-of-answer">${el[0]}</button>
    `;
    fragmentButton.append(answerVariant);
  });
  buttonsWrapper?.append(fragmentButton);
  await playAudio(audio);
  const buttonAudio = document.getElementById('playAudio');
  buttonAudio?.addEventListener('click', () => playAudio(audio));
  buttonAudio?.addEventListener('play', () => playAudio(audio));
  addEventsForChoiceButtons(wordTranslate, gameState, currentWord);
  addEventsForKeyboard(wordTranslate, gameState, currentWord);
}
