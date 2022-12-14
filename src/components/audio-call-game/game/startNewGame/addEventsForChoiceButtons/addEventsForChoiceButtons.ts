import { Word } from 'types/index';
import showCurrentWordInfo from './showCurrentWordInfo/showCurrentWordInfo';
import { GameState } from '../game.types';
import hiddenAllButtons from './hideAnswerButtons/hideAnswerButtons';

export const CHECK_ICON = '\u2713';
export const WRONG_ICON = '\u2716';
const NEXT_QUESTION = 'Next question';

const KeyMapper = {
  Digit1: 'Digit1',
  Digit2: 'Digit2',
  Digit3: 'Digit3',
  Digit4: 'Digit4',
  Digit5: 'Digit5',
  Enter: 'Enter',
  Space: 'Space',
};

export default function addEventsForChoiceButtons(currentWord: string, gameState: GameState, correctWord: Word): void {
  const buttonsChoiceWrapper = document.querySelector('.row-buttons-choice-wrapper');
  const buttonsChoice = document.querySelectorAll('.btn-choice-of-answer');
  buttonsChoiceWrapper?.addEventListener('click', async (e: Event) => checkAnswer(e, 'click', buttonsChoice, currentWord, gameState, correctWord));
}

async function checkAnswer(e: Event, eventExecutor: string, buttonsChoice: NodeListOf<Element>, currentWord: string, gameState: GameState, correctWord: Word) {
  const button = e.target as HTMLElement;
  if (!button.classList.contains('btn-choice-of-answer') && eventExecutor === 'click') {
    return;
  }
  const currentButton = getCheckButton(e, eventExecutor) as HTMLElement;
  const buttonNextQuestion = document.querySelector('.btn-next-question') as HTMLElement;
  if (!currentButton || currentButton.hasAttribute('disabled')) {
    return;
  }
  hiddenAllButtons();

  wordDistribution(currentButton, currentWord, gameState, correctWord);

  showCurrentWordInfo();
  buttonNextQuestion.textContent = NEXT_QUESTION;
}

function getCheckButton(e: Event, eventExecutor: string): HTMLElement | null {
  const buttonNextQuestion = document.querySelector('.btn-next-question');
  if (!buttonNextQuestion) {
    return null;
  }
  if (eventExecutor === 'key') {
    const valuesKeyTargets = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5'];
    const keyTarget = (e as KeyboardEvent).code;
    if (keyTarget === KeyMapper.Enter) {
      buttonNextQuestion?.dispatchEvent(new Event('checkNextQuestion'));
      return null;
    }
    if (keyTarget === KeyMapper.Space) {
      const button = document.querySelector('.button-audio');
      button?.dispatchEvent(new Event('play'));
    }
    if (Object.keys(KeyMapper).includes(keyTarget)) {
      const numberButton = valuesKeyTargets.indexOf(keyTarget);
      const allButtons = document.querySelectorAll('.btn-choice-of-answer');
      const currentButton = allButtons[numberButton];
      (buttonNextQuestion as HTMLElement).dataset.status = 'true';
      (buttonNextQuestion as HTMLElement).dataset.wordchosen = 'true';
      return currentButton as HTMLElement;
    }
  } else if (eventExecutor === 'click') {
    (buttonNextQuestion as HTMLElement).dataset.status = 'true';
    (buttonNextQuestion as HTMLElement).dataset.wordchosen = 'true';
    return e.target as HTMLElement;
  }

  return null;
}

export function addEventsForKeyboard(currentWord: string, gameState: GameState, correctWord: Word) {
  const buttonsChoice = document.querySelectorAll('.btn-choice-of-answer');
  const gamePage = document.querySelector('.row-buttons-choice-wrapper') as HTMLElement;
  gamePage.focus();
  gamePage.addEventListener('keyup', (e) => {
    checkAnswer(e, 'key', buttonsChoice, currentWord, gameState, correctWord);
  });
  gamePage.addEventListener('blur', () => {
    gamePage.focus();
  });
}

export async function wordDistribution(currentButton: HTMLElement, currentWord: string, gameState: GameState, correctWord: Word) {
  const buttonWord = currentButton.textContent;

  const currentIcon = document.createElement('span');
  const word = correctWord;
  if (buttonWord === currentWord) {
    gameState.correctAnswers.push(word);
    gameState.counterStreakForGame += 1;
    if (gameState.counterStreakForGame > gameState.longestStreakForGame) {
      gameState.longestStreakForGame = gameState.counterStreakForGame;
    }
    currentIcon.classList.add('correct-icon-audiocall');
    currentIcon.textContent = CHECK_ICON;
    currentButton.prepend(currentIcon);
    currentButton.classList.add('btn-success');
    currentButton.classList.remove('btn-light');
  } else {
    gameState.wrongAnswers.push(word);
    gameState.counterStreakForGame = 0;
    currentIcon.classList.add('wrong-icon-audiocall');
    currentIcon.textContent = WRONG_ICON;
    currentButton.prepend(currentIcon);
    currentButton.classList.remove('btn-light');
    currentButton.classList.add('btn-danger');
  }
}
