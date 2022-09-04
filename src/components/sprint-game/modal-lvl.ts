import { getWords } from 'API/index';
import { Word } from 'types/index';

export const renderModal = `
  <h1 class="page-heading">
    <span class="page-heading__rslang">RSLang</span> Sprint
  </h1>
  <div class="sprint">
    <div class="modal-lvl">
      <h2>Levels</h2>
      <p>From Easy to most Hard</p>
      <button class="btn btn-lvl btn-primary" data-lvl="0">1</button>
      <button class="btn btn-lvl btn-primary" data-lvl="1">2</button>
      <button class="btn btn-lvl btn-primary" data-lvl="2">3</button>
      <button class="btn btn-lvl btn-primary" data-lvl="3">4</button>
      <button class="btn btn-lvl btn-primary" data-lvl="4">5</button>
      <button class="btn btn-lvl btn-primary" data-lvl="5">6</button>
      <button class="btn btn-lvl btn-primary btn-danger" data-lvl="6">7</button>
      <p class="lvl-instructions">
      Game controls: you can play with both, mouse/touchpad and keyboard.<br>
      Use <kbd>ArrowLeft</kbd> and <kbd>ArrowRight</kbd> to select an answer.
      <p>
      <div class="message"></div>
    </div>
  </div>
`;

export const generateWords = async (lvl: number, currentPage: number): Promise<Word[]> => {
  const promises = [];
  for (let page = 0; page <= currentPage; page += 1) {
    promises.push(getWords(lvl, page));
  }
  const allWords = await Promise.allSettled(promises);
  const allPassedWOrds = allWords
    .filter((result) => result.status === 'fulfilled')
    .map((result) => (result.status === 'fulfilled' ? result.value : []));
  return allPassedWOrds.flat();
};
