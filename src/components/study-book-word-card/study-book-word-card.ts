import { SOURCE } from 'API/index';
import { Word } from 'types/index';
import speakerIcon from './speaker-icon.svg';
import './study-book-word-card.css';

function playAudio(audioBtn: HTMLButtonElement): void {
  const audioTitles = ['Pronunciation', 'Meaning', 'Example'];
  audioBtn.disabled = true;
  audioBtn.classList.add('btn-audio--playing');

  const audioNum = Number(audioBtn.dataset.audio);
  const audioContainer = audioBtn.parentElement as HTMLElement;
  const audio = audioContainer.querySelector(`input[name="audio-${audioNum}`) as HTMLInputElement;
  const audioUrl = audio.value as string;
  const url = `${SOURCE}/${audioUrl}`;

  const audioTitle = audioBtn.querySelector('.btn-audio__audio-title') as HTMLElement;
  audioTitle.innerText = audioTitles[audioNum - 1];

  const music = new Audio(url);
  music.play();
  music.onended = () => {
    audioBtn.disabled = false;
    audioBtn.classList.remove('btn-audio--playing');
    updateBtnAudioNum(audioBtn);
  };
}

function updateBtnAudioNum(audioBtn: HTMLButtonElement): void {
  const curAudioNum = Number(audioBtn.dataset.audio);
  const newAudioNum = curAudioNum >= 3 ? '1' : `${curAudioNum + 1}`;

  audioBtn.dataset.audio = newAudioNum;

  const numOnButton = audioBtn.querySelector('.btn-audio__num') as HTMLElement;
  numOnButton.innerText = newAudioNum;
}

function handleEvents(elem: HTMLElement): void {
  elem.onclick = (e: Event) => {
    const target = e.target as HTMLButtonElement;
    const audioBtn = target.closest('.btn-audio') as HTMLButtonElement;

    if (audioBtn) {
      playAudio(audioBtn);
    }
  };
}

export default function getStudyBookWordCard(word: Word): HTMLElement {
  const elem = document.createElement('article');
  elem.className = 'word-card';

  elem.innerHTML = `
    <div class="word-card__word-info">
      <span class="word-card__word">${word.word}</span>
      <span class="word-card__trancsription">${word.transcription}</span>
      <span class="word-card__word-translate"> - ${word.wordTranslate}</span>
    </div>
    <div class="word-card__image">
    <img src="${SOURCE}/${word.image}">
    </div>
    <div class="word-card__audio">
      <button class="btn-audio" data-id="${word.id}" data-audio="1">
        <img class="btn-audio__speaker-icon" src="${speakerIcon}">
        <div class="btn-audio__audio-title"></div>
      </button>
      <input type="hidden" name="audio-1" value="${word.audio}">
      <input type="hidden" name="audio-2" value="${word.audioMeaning}">
      <input type="hidden" name="audio-3" value="${word.audioExample}">
    </div>
    <div class="word-card__meaning">
      <div class="word-card__data-heading">Meaning:</div>
      <div class="word-card__text">${word.textMeaning}</div>
    </div>
    <div class="word-card__text-translation">
      <span class="word-card__text">(Translation): ${word.textMeaningTranslate}</span>
    </div>
    <div class="word-card__example">
      <div class="word-card__data-heading">Example:</div>
      <div class="word-card__text">${word.textExample}</div>
    </div>
    <div class="word-card__text-translation">
      <span class="word-card__text">(Translation): ${word.textExampleTranslate}</span>
    </div>
    <div class="word-card__buttons"></div>
  `;

  handleEvents(elem);

  // TODO: add buttons to control word status for registered users

  return elem;
}
