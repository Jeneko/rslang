import { WordWithUserWord } from 'types/index';
import './word-statistic.css';

export default function getWordStatistic(word: WordWithUserWord): HTMLElement {
  const elem = document.createElement('div');
  elem.className = 'word-stat-container';

  elem.innerHTML = `
    <div class="word-stat word-stat--wrong" title="Guessed Wrong" data-bs-toggle="tooltip">
      ${word.userWord.optional.guessedWrong}
    </div>
    <div class="word-stat word-stat--right" title="Guessed Right" data-bs-toggle="tooltip">
      ${word.userWord.optional.guessedRight}
    </div>
    <div class="word-stat word-stat--row" title="Guessed in a row" data-bs-toggle="tooltip">
      ${word.userWord.optional.guessedInRow}
    </div>
  `;

  return elem;
}
