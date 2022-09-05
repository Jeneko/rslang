import { SOURCE } from 'API/index';
import { getAuth } from 'utils/auth';
import { WordWithUserWord } from 'types/index';
import { getWordWithUserData } from 'utils/user-words';
import getWordAudio from 'components/word-audio/word-audio';
import getStatusBadge from 'components/status-badge/status-badge';
import getWordStatistic from 'components/word-statistic/word-statistic';
import getWordStatusControls from 'components/word-status-controls/word-status-controls';
import './study-book-word-card.css';

function handleEvents(elem: HTMLElement, wordId: string): void {
  elem.addEventListener('updateWordCard', async () => {
    const word = await getWordWithUserData(wordId);
    const newWordCard = getStudyBookWordCard(word);
    elem.replaceWith(newWordCard);
    newWordCard.dispatchEvent(new Event('updateChapterStatus', { bubbles: true }));
  });

  elem.addEventListener('deleteWordCard', () => {
    (elem.parentElement as HTMLElement).remove();
  });
}

export default function getStudyBookWordCard(word: WordWithUserWord): HTMLElement {
  const curAuth = getAuth();
  const elem = document.createElement('article');
  elem.dataset.status = word.userWord.difficulty;
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
    <div class="word-card__btn-container"></div>
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
  `;

  const wordCardBtnContainer = elem.querySelector('.word-card__btn-container') as HTMLElement;
  wordCardBtnContainer.append(getWordAudio(word));

  // If authorized
  if (curAuth) {
    wordCardBtnContainer.append(getWordStatusControls(word));

    const statusBadge = getStatusBadge(word);
    const wordStats = getWordStatistic(word);

    statusBadge.classList.add('word-card__status-badge');
    wordStats.classList.add('word-card__word-stat-container');

    elem.prepend(statusBadge);
    elem.prepend(wordStats);
  }

  handleEvents(elem, word.id);

  return elem;
}
