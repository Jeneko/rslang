import * as state from 'utils/state';
import './study-book-chapters-menu.css';

function highlightActiveChapter(elem: HTMLElement): void {
  const chapter = state.getState().studyBookChapter;
  const activeChapter = elem.querySelector(`[data-chapter="${chapter}"]`) as HTMLButtonElement;

  if (activeChapter) {
    activeChapter.disabled = true;
  }
}

function handleEvents(elem: HTMLElement): void {
  elem.onclick = (e) => {
    e.preventDefault();
    const target = e.target as HTMLLinkElement;

    // Click on buttons
    const btn = target.closest('.btn-select-chapter') as HTMLElement;
    if (btn) {
      const chapter = btn.dataset.chapter as string;
      state.updateState('studyBookChapter', chapter);
      state.updateState('studyBookPage', 0);
      elem.dispatchEvent(new Event('loadStudyBookChapter', { bubbles: true }));
    }
  };
}

export default function getStudyBookChaptersMenu(): HTMLElement {
  const elem = document.createElement('div');
  elem.className = 'study-book-chapters-menu';

  elem.innerHTML = `
    <h2>Chapters</h2>
    <p>From Easy to most Hard<p>
    <ol>
      <li><button class="btn btn-primary btn-select-chapter" data-chapter="0">1</button></li>
      <li><button class="btn btn-primary btn-select-chapter" data-chapter="1">2</button></li>
      <li><button class="btn btn-primary btn-select-chapter" data-chapter="2">3</button></li>
      <li><button class="btn btn-primary btn-select-chapter" data-chapter="3">4</button></li>
      <li><button class="btn btn-primary btn-select-chapter" data-chapter="4">5</button></li>
      <li><button class="btn btn-primary btn-select-chapter" data-chapter="5">6</button></li>
      <li><button class="btn btn-danger btn-select-chapter" data-chapter="6">7</button></li>
    </ol>
  `;

  highlightActiveChapter(elem);
  handleEvents(elem);

  return elem;
}
