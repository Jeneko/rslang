import * as state from 'utils/state';
import getFooter from 'components/footer/footer';
import getMiniGamesMenu from 'components/mini-games-menu/mini-games-menu';
import getStudyBookWordsList from 'components/study-book-words-list/study-book-words-list';
import getStudyBookChaptersMenu from 'components/study-book-chapters-menu/study-book-chapters-menu';
import './study-book-page.css';

function handleEvents(elem: HTMLElement): void {
  // Change Chapter
  elem.addEventListener('loadStudyBookChapter', async () => {
    elem.replaceWith(await getStudyBookPage());
  });
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
    </div>
  `;

  const container = elem.querySelector('.container') as HTMLElement;
  const chaptersMenu = elem.querySelector('.chapters-menu') as HTMLElement;
  const miniGamesMenu = elem.querySelector('.mini-games-menu') as HTMLElement;

  chaptersMenu.replaceWith(getStudyBookChaptersMenu());
  miniGamesMenu.replaceWith(getMiniGamesMenu());
  container.append(await getStudyBookWordsList());
  elem.append(getFooter());

  handleEvents(elem);

  return elem;
}
