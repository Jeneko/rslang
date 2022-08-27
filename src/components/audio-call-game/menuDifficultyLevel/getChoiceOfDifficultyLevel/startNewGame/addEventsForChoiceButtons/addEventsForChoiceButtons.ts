import { getWord } from 'API/index';
import showCurrentWordInfo from './showCurrentWordInfo/showCurrentWordInfo';
import { GameState } from '../game.types';
import hiddenAllButtons from './disableAllButtonsChoice/disableAllButtonsChoice';

export const CHECKICON = '\u2713';
export const WRONGICON = '\u2716';
const nextQuestion = 'Next question';

export default function addEventsForChoiceButtons(currentWord: string, gameState: GameState): void {
  const buttonsChoiceWrapper = document.querySelector('.row-buttons-choice-wrapper');
  const buttonsChoice = document.querySelectorAll('.btn-choice-of-answer');
  buttonsChoiceWrapper?.addEventListener('click', async (e: Event) => checkAnswer(e, 'click', buttonsChoice, currentWord, gameState));
  console.log(currentWord, 'current');
}

async function checkAnswer(e: Event, eventExecutor: string, buttonsChoice: NodeListOf<Element>, currentWord: string, gameState: GameState) {
  const button = e.target as HTMLElement;
  if (!button.classList.contains('btn-choice-of-answer') && eventExecutor === 'click') {
    return;
  }
  const currentButton = getCheckButton(e, eventExecutor) as HTMLElement | null;
  const buttonNextQuestion = document.querySelector('.btn-next-question') as HTMLElement;
  if (!currentButton || currentButton.hasAttribute('disabled')) {
    return;
  }
  hiddenAllButtons();

  wordDistribution(currentButton, currentWord, gameState);

  showCurrentWordInfo();
  buttonNextQuestion.textContent = nextQuestion;
}

function getCheckButton(e: Event, eventExecutor: string): HTMLElement | null {
  if (eventExecutor === 'key') {
    const valuesKeyTargets = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5'];
    const keyTarget = (e as KeyboardEvent).code;
    console.log(keyTarget);
    if (keyTarget === 'Enter') {
      console.log('enter');
      const buttonNextQuestion = document.querySelector('.btn-next-question');
      const event = new Event('checkNextQuestion');
      buttonNextQuestion?.dispatchEvent(event);
    }
    if (valuesKeyTargets.includes(keyTarget)) {
      const numberButton = valuesKeyTargets.indexOf(keyTarget);
      const allButtons = document.querySelectorAll('.btn-choice-of-answer');
      const currentButton = allButtons[numberButton];
      const buttonNextQuestion = document.querySelector('.btn-next-question');
      buttonNextQuestion?.setAttribute('wordchosen', 'true');
      return currentButton as HTMLElement;
    }
  } else if (eventExecutor === 'click') {
    const buttonNextQuestion = document.querySelector('.btn-next-question');
    buttonNextQuestion?.setAttribute('wordchosen', 'true');
    return e.target as HTMLElement;
  }

  return null;
}

export function addEventsForKeyboard(currentWord: string, gameState: GameState) {
  const buttonsChoice = document.querySelectorAll('.btn-choice-of-answer');
  const gamePage = document.querySelector('.row-buttons-choice-wrapper') as HTMLElement;
  gamePage.focus();
  gamePage.addEventListener('keyup', (e) => {
    checkAnswer(e, 'key', buttonsChoice, currentWord, gameState);
  });
  gamePage.addEventListener('blur', () => {
    gamePage.focus();
  });
}

export async function wordDistribution(currentButton: HTMLElement, currentWord: string, gameState: GameState) {
  const buttonWord = currentButton.textContent;

  const currentIcon = document.createElement('span');
  const wordId = (currentButton as HTMLElement).dataset.id as string;
  const word = await getWord(wordId);
  console.log(buttonWord, currentWord);
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
}
