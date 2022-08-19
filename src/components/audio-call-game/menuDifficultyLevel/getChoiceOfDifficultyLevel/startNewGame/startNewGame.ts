import controlGameWindow from '../../controlGameWindow/controlGameWindow';
import { getWords } from '../../../../../API/index';
import generateWindowGame from './generateWindowGame/generateWindowGame';
import { updateState } from '../../../../../utils/state';

export default async function startNewGame(event: Event) {
  console.log('click');
  const { target } = event;
  if ((target as HTMLElement).classList.contains('btn-check')) {
    const currentLevel = ((target as HTMLElement).dataset.level);
    controlGameWindow(true);
    if (currentLevel) {
      updateState('indexWord', 0);
      const numberPage = 0;
      const listWords = await getWords(+currentLevel, 0);
      const windowGame = await generateWindowGame(listWords[0], listWords, numberPage);
      console.log(windowGame);
    }
  }
}
