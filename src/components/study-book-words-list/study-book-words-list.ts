import * as auth from 'utils/auth';
import * as state from 'utils/state';
import { getWordsWithUserData, getAllUserWordsWithData } from 'utils/user-words';
import getStudyBookWordCard from 'components/study-book-word-card/study-book-word-card';
import getStudyBookPagination from 'components/study-book-pagination/study-book-pagination';
import './study-book-words-list.css';

function updateChapterStatus(wordsList: HTMLElement): void {
  const { isUserChapter } = state.getState();

  if (isUserChapter) return;

  const badgesHard = wordsList.querySelectorAll('.status-badge--hard');
  const badgesLearned = wordsList.querySelectorAll('.status-badge--learned');
  const chapterStatus = wordsList.querySelector('.study-book-chapter-status') as HTMLElement;

  if (badgesHard.length >= 20) {
    wordsList.classList.add('study-book-words-list--hard');
    chapterStatus.textContent = '| Hard list';
    return;
  }

  if (badgesLearned.length >= 20) {
    wordsList.classList.add('study-book-words-list--learned');
    chapterStatus.textContent = '| Learn Complete';
    return;
  }

  chapterStatus.textContent = '';
  wordsList.classList.remove('study-book-words-list--hard');
  wordsList.classList.remove('study-book-words-list--learned');
}

function handleEvents(elem: HTMLElement): void {
  elem.addEventListener('updateChapterStatus', () => updateChapterStatus(elem));
}

export default async function getStudyBookWordsList(): Promise<HTMLElement> {
  const curAuth = auth.getAuth();
  const curState = state.getState();
  const curChapter = Number(curState.studyBookChapter) + 1;
  const curPage = Number(curState.studyBookPage) + 1;
  const { isUserChapter } = curState;

  const elem = document.createElement('div');
  elem.className = 'study-book-words-list';

  const pageInfo = isUserChapter
    ? 'User Words'
    : `Page ${curPage}`;

  const registerToUseHTML = `
    <p class="text-center">
      Chapter 7 contains the most difficult words user selected manually.
      Please, <a class="load-page-link" href="#login">Login</a>
      or <a class="load-page-link" href="#register">Register</a>
      to start using this chapter.
    </p>
  `;

  elem.innerHTML = `
    <h2 class="study-book-chapter-heading">
      Chapter ${curChapter} | ${pageInfo}
      <span class="study-book-chapter-status"></span>
    </h2>
    ${!curAuth && isUserChapter ? registerToUseHTML : ''}
  `;

  // Get apropriate set of words
  const words = isUserChapter
    ? await getAllUserWordsWithData()
    : await getWordsWithUserData(curState.studyBookChapter, curState.studyBookPage);

  // Fill words list with words
  if (words.length) {
    const orderedList = document.createElement('ol');

    words.forEach((word) => {
      const listItem = document.createElement('li');
      listItem.append(getStudyBookWordCard(word));
      orderedList.append(listItem);
    });

    elem.append(orderedList);
  }

  // If current chapter is empty User Chapter and user is authorized
  if (isUserChapter && !words.length && curAuth) {
    elem.innerHTML += `
      <p class="text-center">
        For now there is no words in this chapter. Mark words as <b>Hard</b> to add them into <b>Chapter 7 | User Words.</b>
      </p>
    `;
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
