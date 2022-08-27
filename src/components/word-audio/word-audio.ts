import { SOURCE } from 'API/index';
import { WordWithUserWord } from 'types/index';
import speakerIcon from './word-audio.svg';
import './word-audio.css';

function updateBtnAudioNum(audioBtn: HTMLButtonElement): void {
  const curAudioNum = Number(audioBtn.dataset.audio);
  const newAudioNum = curAudioNum >= 3 ? '1' : `${curAudioNum + 1}`;

  audioBtn.dataset.audio = newAudioNum;
}

function playAudio(e: Event): void {
  const audioTitles = ['Pronunciation', 'Meaning', 'Example'];
  const audioBtn = e.currentTarget as HTMLButtonElement;

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

function handleEvents(elem: HTMLElement): void {
  const btnAudio = elem.querySelector('.btn-audio') as HTMLElement;

  btnAudio.addEventListener('click', playAudio);
}

export default function getWordAudio(word: WordWithUserWord): HTMLElement {
  const elem = document.createElement('div');
  elem.className = 'word-audio';

  elem.innerHTML = `
    <button class="btn-audio" data-id="${word.id}" data-audio="1">
      <img class="btn-audio__speaker-icon" src="${speakerIcon}">
      <div class="btn-audio__audio-title"></div>
    </button>
    <input type="hidden" name="audio-1" value="${word.audio}">
    <input type="hidden" name="audio-2" value="${word.audioMeaning}">
    <input type="hidden" name="audio-3" value="${word.audioExample}">
  `;

  handleEvents(elem);

  return elem;
}
