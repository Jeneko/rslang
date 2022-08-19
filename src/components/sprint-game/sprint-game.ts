import { modalLevelHandler, renderModal } from './modal-lvl';

// Dummy function content (to be replaced)
// export default async function getSprintGame(): Promise<HTMLElement> {
//   const words = await getWords(0, 0);
//   const elem = document.createElement('div');
//   elem.className = 'sprint-game';

//   elem.innerHTML = `
//     <h2>Sprint mini-game</h2>
//     <pre>
//       ${JSON.stringify(words, null, 2)}
//     </pre>
//   `;

//   return elem;
// }

export default function getSprintGame() {
  const elem = document.createElement('div');
  elem.className = 'sprint-game';
  elem.innerHTML = renderModal();
  modalLevelHandler(elem);
  return elem;
}
