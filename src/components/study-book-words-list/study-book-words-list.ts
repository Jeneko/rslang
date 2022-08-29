import * as auth from 'utils/auth';
import * as state from 'utils/state';
import { getWordsWithUserData, getAllUserWordsWithData } from 'utils/user-words';
import getStudyBookWordCard from 'components/study-book-word-card/study-book-word-card';
import getStudyBookPagination from 'components/study-book-pagination/study-book-pagination';
import { registerToUseHTML, emptyUserChapterHTML } from './study-book-words-list-html';
import './study-book-words-list.css';

const enum ChapterStatus {
  HardList = 'Hard list',
  LearnComplete = 'Learn Complete',
}

function updateChapterInfo(wordsList: HTMLElement): void {
  const { isUserChapter } = state.getState();
  const wordsCards = wordsList.querySelectorAll('.word-card');

  if (wordsCards.length && isUserChapter) {
    const chapterInfo = wordsList.querySelector('.study-book-chapter-info') as HTMLElement;
    chapterInfo.innerHTML = emptyUserChapterHTML;
  }
}

function updateChapterStatus(wordsList: HTMLElement): void {
  const { isUserChapter } = state.getState();
  const wordsCards = wordsList.querySelectorAll('.word-card');
  const badgesHard = wordsList.querySelectorAll('.status-badge--hard');
  const badgesLearned = wordsList.querySelectorAll('.status-badge--learned');
  const chapterStatus = wordsList.querySelector('.study-book-chapter-status') as HTMLElement;

  if (isUserChapter) return;

  if (badgesHard.length === wordsCards.length) {
    wordsList.classList.add('study-book-words-list--hard');
    chapterStatus.textContent = `| ${ChapterStatus.HardList}`;
    return;
  }

  if (badgesLearned.length === wordsCards.length) {
    wordsList.classList.add('study-book-words-list--learned');
    chapterStatus.textContent = `| ${ChapterStatus.LearnComplete}`;
    return;
  }

  chapterStatus.textContent = '';
  wordsList.classList.remove('study-book-words-list--hard');
  wordsList.classList.remove('study-book-words-list--learned');
}

function handleEvents(elem: HTMLElement): void {
  elem.addEventListener('updateChapterStatus', () => updateChapterStatus(elem));
  elem.addEventListener('deleteWordCard', () => updateChapterInfo(elem));
}

export default async function getStudyBookWordsList(): Promise<HTMLElement> {
  const curAuth = auth.getAuth();
  const { studyBookChapter, studyBookPage, isUserChapter } = state.getState();
  const curChapter = Number(studyBookChapter) + 1;
  const curPage = Number(studyBookPage) + 1;

  const elem = document.createElement('div');
  elem.className = 'study-book-words-list';

  const pageInfo = isUserChapter ? 'User Words' : `Page ${curPage}`;

  elem.innerHTML = `
    <h2 class="study-book-chapter-heading">
      Chapter ${curChapter} | ${pageInfo}
      <span class="study-book-chapter-status"></span>
    </h2>
    <div class="study-book-chapter-info">
      ${!curAuth && isUserChapter ? registerToUseHTML : ''}
    </div>
    <ol></ol>
  `;

  // Get apropriate set of words
  const words = isUserChapter
    ? await getAllUserWordsWithData()
    : await getWordsWithUserData(studyBookChapter, studyBookPage);

  // Fill words list with words
  if (words.length) {
    const list = elem.querySelector('ol') as HTMLElement;

    words.forEach((word) => {
      const listItem = document.createElement('li');
      listItem.append(getStudyBookWordCard(word));
      list.append(listItem);
    });
  }

  // If current chapter is empty User Chapter and user is authorized
  if (isUserChapter && !words.length && curAuth) {
    const chapterInfo = elem.querySelector('.study-book-chapter-info') as HTMLElement;
    chapterInfo.innerHTML = emptyUserChapterHTML;
  }

  // Add pagination if current chapter is NOT User Chapter
  if (!isUserChapter) {
    (elem.firstElementChild as HTMLElement).after(getStudyBookPagination());
    elem.append(getStudyBookPagination());
  }

  handleEvents(elem);
  updateChapterStatus(elem);

  return elem;
}
