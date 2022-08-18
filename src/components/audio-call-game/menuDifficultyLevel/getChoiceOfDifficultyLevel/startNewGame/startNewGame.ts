import controlGameWindow from '../../controlGameWindow/controlGameWindow';
import { getWords } from '../../../../../API/index';
import generateWindowGame from './generateWindowGame/generateWindowGame';

export default async function startNewGame(event: Event) {
  const { target } = event;
  if ((target as HTMLElement).classList.contains('btn-check')) {
    const currentLevel = ((target as HTMLElement).dataset.level);
    controlGameWindow(true);
    if (currentLevel) {
      const listWords = await getWords(+currentLevel, 0);
      const windowGame = await generateWindowGame(listWords[0], listWords);
      console.log(windowGame);
    }
  }
}
