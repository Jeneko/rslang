import clearGameWindow from './clearGameWindow/clearGameWindow';
import { Word } from '../../../../../../types/index';
import nextQuestion from '../nextQuestion/nextQuestion';

export default function addEventsForNextQuestionButton(indexWord: number, numberPage: number, listWords: Word[]) {
  const buttonNextQuestion = document.querySelector('.btn-next-question');
  buttonNextQuestion?.addEventListener('click', () => {
    const newCurrentlyWord = indexWord + 1;
    clearGameWindow();
    nextQuestion(listWords[newCurrentlyWord], listWords, numberPage);
  });
}
