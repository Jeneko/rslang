import showCurrentWordInfo from './showCurrentWordInfo/showCurrentWordInfo';
import { GameState } from '../game.types';
import { getWord } from '../../../../../../API/index';

export default function addEventsForChoiceButtons(currentWord: string, gameState: GameState): void {
  const buttonsChoice = document.querySelectorAll('.btn-choice-of-answer');

  buttonsChoice.forEach((el) => {
    el.addEventListener('click', async (e: Event) => {
      const currentButton = e.target as HTMLElement;
      const buttonWord = currentButton.textContent;
      const buttonNextQuestion = document.querySelector('.btn-next-question') as HTMLElement;
      const currentIcon = document.createElement('span');
      const wordId = (currentButton as HTMLElement).dataset.id as string;
      const word = await getWord(wordId);
      if (buttonWord === currentWord) {
        gameState.correctAnswers.push(word);
        currentIcon.textContent = '\u2713';
        currentButton.prepend(currentIcon);
        currentButton.classList.add('btn-success');
        currentButton.classList.remove('btn-light');
      } else {
        gameState.wrongAnswers.push(word);
        currentIcon.textContent = '\u2716';
        currentButton.prepend(currentIcon);
        currentButton.classList.remove('btn-light');
        currentButton.classList.add('btn-danger');
      }
      buttonsChoice.forEach((button) => button.setAttribute('disabled', 'true'));
      showCurrentWordInfo();
      buttonNextQuestion.textContent = 'Следующий вопрос';
    });
  });
}
