import { getWord } from 'API/index';
import showCurrentWordInfo from './showCurrentWordInfo/showCurrentWordInfo';
import { GameState } from '../game.types';

export const CHECKICON = '\u2713';
export const WRONGICON = '\u2716';
const nextQuestion = 'Next question';

export default function addEventsForChoiceButtons(currentWord: string, gameState: GameState): void {
  const buttonsChoiceWrapper = document.querySelector('.row-buttons-choice-wrapper');
  const buttonsChoice = document.querySelectorAll('.btn-choice-of-answer');

  buttonsChoiceWrapper?.addEventListener('click', async (e: Event) => {
    const currentButton = e.target as HTMLElement;
    if (!currentButton.classList.contains('btn-choice-of-answer')) {
      return;
    }

    const buttonWord = currentButton.textContent;
    const buttonNextQuestion = document.querySelector('.btn-next-question') as HTMLElement;
    const currentIcon = document.createElement('span');
    const wordId = (currentButton as HTMLElement).dataset.id as string;
    const word = await getWord(wordId);
    if (buttonWord === currentWord) {
      gameState.correctAnswers.push(word);
      currentIcon.textContent = CHECKICON;
      currentButton.prepend(currentIcon);
      currentButton.classList.add('btn-success');
      currentButton.classList.remove('btn-light');
    } else {
      gameState.wrongAnswers.push(word);
      currentIcon.textContent = WRONGICON;
      currentButton.prepend(currentIcon);
      currentButton.classList.remove('btn-light');
      currentButton.classList.add('btn-danger');
    }
    buttonsChoice.forEach((button) => button.setAttribute('disabled', 'true'));
    showCurrentWordInfo();
    buttonNextQuestion.textContent = nextQuestion;
  });
}