import { getWords } from 'API/index';
import { Word } from 'types/index';
// import { Word } from 'types/index';

export const renderModal = `
  <h1 class="page-heading">
    <span class="page-heading__rslang">RSLang</span> Sprint
  </h1>
  <div class="sprint">
    <div class="modal-lvl">
      <p>From Easy to most Hard</p>
      <button class="btn btn-lvl btn-primary" data-lvl="0">1</button>
      <button class="btn btn-lvl btn-primary" data-lvl="1">2</button>
      <button class="btn btn-lvl btn-primary" data-lvl="2">3</button>
      <button class="btn btn-lvl btn-primary" data-lvl="3">4</button>
      <button class="btn btn-lvl btn-primary" data-lvl="4">5</button>
      <button class="btn btn-lvl btn-primary" data-lvl="5">6</button>
    </div>
  </div>
`;

export const generateWords = async (lvl: number): Promise<Word[]> => {
  const promises = [];
  for (let page = 0; page < 30; page += 1) {
    promises.push(getWords(lvl, page));
  }
  const allWords = await Promise.allSettled(promises);
  const allPassedWOrds = allWords
    .filter((result) => result.status === 'fulfilled')
    .map((result) => (result.status === 'fulfilled' ? result.value : []));
  return allPassedWOrds.flat();
};
