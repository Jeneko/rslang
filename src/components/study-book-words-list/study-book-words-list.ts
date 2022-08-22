import * as state from 'utils/state';
import { getWords } from 'API/index';
import getStudyBookWordCard from 'components/study-book-word-card/study-book-word-card';
import getStudyBookPagination from 'components/study-book-pagination/study-book-pagination';
import './study-book-words-list.css';

export default async function getStudyBookWordsList(): Promise<HTMLElement> {
  const curState = state.getState();

  const elem = document.createElement('div');
  elem.className = 'study-book-words-list';

  const standardBookChapterHTML = `
    <h2 class="study-book-chapter-heading">Chapter ${Number(curState.studyBookChapter) + 1} | Page ${Number(curState.studyBookPage) + 1}</h2>
    <ol></ol>
  `;

  const userBookChapterHTML = `
    <h2 class="study-book-chapter-heading">Chapter ${Number(curState.studyBookChapter) + 1} | User Words</h2>
    <p>Chapter 7 contains the most difficult words user selected manually. Please, <a href="#">Login or Register</a> to start using this chapter.</p>
    <ol></ol>
  `;

  elem.innerHTML = (Number(curState.studyBookChapter) >= 6) ? userBookChapterHTML : standardBookChapterHTML;

  const words = await getWords(curState.studyBookChapter, curState.studyBookPage);
  const orderedList = elem.querySelector('ol') as HTMLElement;

  words.forEach((word) => {
    const listItem = document.createElement('li');
    listItem.append(getStudyBookWordCard(word));
    orderedList.append(listItem);
  });

  if (Number(curState.studyBookChapter) !== 6) {
    (elem.firstElementChild as HTMLElement).after(getStudyBookPagination());
    elem.append(getStudyBookPagination());
  }

  return elem;
}
