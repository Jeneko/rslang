import { getWords } from 'API/index';

export const renderModal = () => `
<h1 class="page-heading">
    <span class="page-heading__rslang">RSLang</span> Sprint
</h1>
<div class="sprint">
    <div class="modal-lvl">
    <p>From Easy to most Hard<p>
    <button class="btn btn-lvl" id="level-0">1</button>
    <button class="btn btn-lvl" id="level-1">2</button>
    <button class="btn btn-lvl" id="level-2">3</button>
    <button class="btn btn-lvl" id="level-3">4</button>
    <button class="btn btn-lvl" id="level-4">5</button>
    <button class="btn btn-lvl" id="level-5">6</button>
  </div>
</div>
`;

export const generateWords = async (lvl: number) => {
  const promises = [];
  for (let i = 0; i < 30; i += 1) {
    promises.push(getWords(lvl, i));
  }
  const allWords = await Promise.all(promises);
  return allWords.flat();
};
