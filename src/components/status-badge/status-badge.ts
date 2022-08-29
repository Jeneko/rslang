import * as state from 'utils/state';
import { updateLearnedStatistic } from 'utils/statistic';
import { WordWithUserWord, WordStatus } from 'types/index';
import { setWordStatus } from 'utils/user-words';
import crossIconUrl from './cross.svg';
import './status-badge.css';

async function markDefault(e: Event) {
  const { isUserChapter } = state.getState();
  const target = e.currentTarget as HTMLButtonElement;
  const wordId = target.dataset.id as string;
  const wordCard = target.closest('.word-card') as HTMLElement;

  target.disabled = true;
  await setWordStatus(wordId, WordStatus.default);
  if (wordCard.dataset.status === WordStatus.learned) {
    await updateLearnedStatistic(-1);
  }
  target.disabled = false;

  target.dispatchEvent(new Event(isUserChapter ? 'deleteWordCard' : 'updateWordCard', { bubbles: true }));
}

function handleEvents(elem: HTMLButtonElement): void {
  elem.addEventListener('click', markDefault);
}

export default function getStatusBadge(word: WordWithUserWord): HTMLElement {
  const elem = document.createElement('button');
  elem.className = `status-badge status-badge--${word.userWord.difficulty}`;
  elem.dataset.id = word.id;
  elem.title = 'Remove';

  elem.innerHTML = `
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    ${word.userWord.difficulty}
    <img class="status-badge__cross-icon" src="${crossIconUrl}">
  `;

  handleEvents(elem);

  return elem;
}
