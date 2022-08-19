import clearGameWindow from './clearGameWindow/clearGameWindow';
import { Word } from '../../../../../../types/index';
import nextQuestion from '../nextQuestion/nextQuestion';
import { getState, updateState } from '../../../../../../utils/state';

export default function addEventsForNextQuestionButton(numberPage: number, listWords: Word[]) {
  const buttonNextQuestion = document.querySelector('.btn-next-question');
  buttonNextQuestion?.addEventListener('click', () => {
    const currentIndex = getState().indexWord + 1;
    updateState('indexWord', currentIndex);
    clearGameWindow();
    if (currentIndex >= listWords.length) {
      console.log('finish');
    } else {
      nextQuestion(listWords[currentIndex], listWords, numberPage);
    }
  });
}
