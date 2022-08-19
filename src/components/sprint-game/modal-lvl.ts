import { getWords } from 'API/index';

export const renderModal = () => `
<div class="modal-lvl">
<button class="btn" id="level-0">1</button>
<button class="btn" id="level-1">2</button>
<button class="btn" id="level-2">3</button>
<button class="btn" id="level-3">4</button>
<button class="btn" id="level-4">5</button>
<button class ="btn" id="level-5">6</button>
</div>
`;

const generateWordsState = async (lvl: number) => {
  const promises = [];
  for (let i = 0; i < 30; i += 1) {
    promises.push(getWords(lvl, i));
  }
  const allWords = await Promise.all(promises);
  return {
    level: lvl,
    words: allWords.flat(),
  };
};

export const modalLevelHandler = (elem: HTMLElement) => {
  elem?.addEventListener('click', (event: MouseEvent) => {
    const { classList } = event.target as Element;
    if (classList.contains('btn')) {
      const { id } = event.target as HTMLButtonElement;
      const lvl = Number(id.split('-')[1]);
      generateWordsState(lvl);
      console.log(generateWordsState(lvl));
    }
  });
};
