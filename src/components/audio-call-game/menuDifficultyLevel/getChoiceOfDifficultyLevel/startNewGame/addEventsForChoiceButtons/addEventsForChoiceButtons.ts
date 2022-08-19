// import showButtonNextQuestion from '../showButtonNextQuestion/showButtonNextQuestion';
import showCurrentWordInfo from './showCurrentWordInfo/showCurrentWordInfo';

export default function addEventsForChoiceButtons(currentWord: string) {
  const buttonsChoice = document.querySelectorAll('.btn-choice-of-answer');
  buttonsChoice.forEach((el) => {
    el.addEventListener('click', (e: Event) => {
      console.log('click');
      const { target } = e;
      const buttonWord = (target as HTMLElement).textContent;
      console.log(buttonWord, currentWord);
      if (buttonWord === currentWord) {
        (target as HTMLElement).classList.add('btn-success');
        (target as HTMLElement).classList.remove('btn-light');
      } else {
        (target as HTMLElement).classList.remove('btn-light');
        (target as HTMLElement).classList.add('btn-danger');
      }
      // showButtonNextQuestion();
      showCurrentWordInfo();
    });
  });
}
