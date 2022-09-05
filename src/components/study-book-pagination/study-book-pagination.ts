import * as state from 'utils/state';
import './study-book-pagination.css';

const PAGE_LIMIT = 30;

function setBtnPaginationStatus(elem: HTMLElement): void {
  const curPage = state.getState().studyBookPage;
  const prevBtn = elem.querySelector('.btn-pagination-prev') as HTMLButtonElement;
  const nextBtn = elem.querySelector('.btn-pagination-next') as HTMLButtonElement;

  prevBtn.disabled = curPage <= 0;
  nextBtn.disabled = curPage >= PAGE_LIMIT - 1;
}

function handleEvents(elem: HTMLElement): void {
  // Clink on the Buttons
  elem.onclick = (e: Event) => {
    const target = e.target as HTMLButtonElement;
    const curPage = state.getState().studyBookPage;
    let newPage = curPage;

    // Click Prev
    if (target.classList.contains('btn-pagination-prev')) {
      newPage = curPage > 0 ? curPage - 1 : curPage;
    }

    // Click Next
    if (target.classList.contains('btn-pagination-next')) {
      newPage = curPage < PAGE_LIMIT - 1 ? curPage + 1 : curPage;
    }

    if (newPage !== curPage) {
      state.updateState('studyBookPage', newPage);
      elem.dispatchEvent(new Event('loadStudyBookChapter', { bubbles: true }));
    }
  };

  // Change page from select
  elem.onchange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    state.updateState('studyBookPage', Number(target.value));
    elem.dispatchEvent(new Event('loadStudyBookChapter', { bubbles: true }));
  };
}

export default function getStudyBookPagination(): HTMLElement {
  const curPage = state.getState().studyBookPage;
  const elem = document.createElement('div');
  elem.className = 'study-book-pagination';

  let pageSelectHTML = '<select class="form-select study-book-pagination__cur-page">';
  for (let i = 0; i < PAGE_LIMIT; i += 1) {
    const status = i === Number(curPage) ? 'selected' : '';
    pageSelectHTML += `<option value="${i}" ${status}>${i + 1}</option>`;
  }
  pageSelectHTML += '</select>';

  elem.innerHTML = `
    <button class="btn btn-secondary btn-pagination-prev">Prev</button>
    ${pageSelectHTML}
    <button class="btn btn-secondary btn-pagination-next">Next</button>
  `;

  setBtnPaginationStatus(elem);
  handleEvents(elem);

  return elem;
}
