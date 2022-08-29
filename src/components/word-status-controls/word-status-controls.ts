import * as state from 'utils/state';
import { setWordStatus } from 'utils/user-words';
import { WordWithUserWord, WordStatus } from 'types/index';

async function markHard(e: Event) {
  const target = e.target as HTMLButtonElement;
  const wordId = target.dataset.id as string;

  target.disabled = true;
  await setWordStatus(wordId, WordStatus.hard);
  target.disabled = false;

  target.dispatchEvent(new Event('updateWordCard', { bubbles: true }));
}

async function markLearned(e: Event) {
  const { isUserChapter } = state.getState();
  const target = e.target as HTMLButtonElement;
  const wordId = target.dataset.id as string;

  target.disabled = true;
  await setWordStatus(wordId, WordStatus.learned);
  target.disabled = false;

  target.dispatchEvent(new Event(isUserChapter ? 'deleteWordCard' : 'updateWordCard', { bubbles: true }));
}

function handleEvents(elem: HTMLElement): void {
  const { isUserChapter } = state.getState();
  const btnMarkDifficult = elem.querySelector('.btn-mark-hard') as HTMLElement;
  const btnMarkLearned = elem.querySelector('.btn-mark-learned') as HTMLElement;

  btnMarkLearned.addEventListener('click', markLearned);

  if (!isUserChapter) {
    btnMarkDifficult.addEventListener('click', markHard);
  }
}

export default function getWordStatusControls(word: WordWithUserWord): HTMLElement {
  const { isUserChapter } = state.getState();
  const elem = document.createElement('div');
  elem.className = 'word-status-controls';

  const btnMarkLearned = `
    <button class="btn btn-success btn-sm btn-mark-learned" data-id="${word.id}">
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Learned
    </button>
  `;

  const btnMarkhard = `
    <button class="btn btn-danger btn-sm btn-mark-hard" data-id="${word.id}">
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Hard
    </button>
  `;

  elem.innerHTML = isUserChapter ? `${btnMarkLearned}` : `${btnMarkhard}${btnMarkLearned}`;

  handleEvents(elem);

  return elem;
}
