import * as state from 'utils/state';
import getFooter from 'components/footer/footer';
import getMiniGamesMenu from 'components/mini-games-menu/mini-games-menu';
import getStudyBookWordsList from 'components/study-book-words-list/study-book-words-list';
import getStudyBookChaptersMenu from 'components/study-book-chapters-menu/study-book-chapters-menu';
import './study-book-page.css';

function toggleMiniGameMenu(e: Event): void {
  const elem = e.currentTarget as HTMLElement;
  const miniGameMenu = elem.querySelector('.mini-games-menu') as HTMLElement;
  const isLearned = isWordListLearned(elem);

  miniGameMenu.hidden = isLearned;
}

function isWordListLearned(elem: HTMLElement): boolean {
  const wordCards = elem.querySelectorAll('.word-card');
  const learnedBadges = elem.querySelectorAll('.status-badge--learned');

  return wordCards.length === learnedBadges.length;
}

function handleEvents(elem: HTMLElement): void {
  // Change Chapter
  elem.addEventListener('loadStudyBookChapter', async () => {
    elem.replaceWith(await getStudyBookPage());
  });

  // Update Chapter Status
  elem.addEventListener('deleteWordCard', toggleMiniGameMenu);
  elem.addEventListener('updateChapterStatus', toggleMiniGameMenu);
}

export default async function getStudyBookPage(): Promise<HTMLElement> {
  const curState = state.getState();
  const elem = document.createElement('div');
  elem.className = `study-book-page study-book-page--chapter-${Number(curState.studyBookChapter) + 1}`;

  elem.innerHTML = `
    <div class="container">
      <h1 class="page-heading">
        <span class="page-heading__rslang">RSLang</span> Study Book
      </h1>
      <div class="study-book-menus">
        <div class="chapters-menu"></div>
        <div class="mini-games-menu"></div>
      </div>
      <div class="words-list"></div>
    </div>
  `;

  const chaptersMenu = elem.querySelector('.chapters-menu') as HTMLElement;
  const miniGamesMenu = elem.querySelector('.mini-games-menu') as HTMLElement;
  const wordsListContainer = elem.querySelector('.words-list') as HTMLElement;

  const miniGameMenu = getMiniGamesMenu();
  const wordsList = await getStudyBookWordsList();
  const isLearned = isWordListLearned(wordsList);

  miniGameMenu.hidden = isLearned;

  miniGamesMenu.replaceWith(miniGameMenu);
  chaptersMenu.replaceWith(getStudyBookChaptersMenu());
  wordsListContainer.replaceWith(wordsList);
  elem.append(getFooter());

  handleEvents(elem);

  return elem;
}
