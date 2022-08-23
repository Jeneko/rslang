import { Word } from 'types/index';
import { GetRandomWordsType } from './getRandomWords.types';

export default function getRandomWords(currentWord: Word, listWords: Word[]): GetRandomWordsType[] {
  const list: GetRandomWordsType[] = [[currentWord.wordTranslate, currentWord.id]];
  const MAX_AMOUNT_ANSWERS = 5;
  const MAX_AMOUNT_WORDS_IN_PAGE = 20;
  while (list.length < MAX_AMOUNT_ANSWERS) {
    const randomIndex = Math.trunc(Math.random() * MAX_AMOUNT_WORDS_IN_PAGE);
    const newWord = listWords[randomIndex].wordTranslate;
    const idWord = listWords[randomIndex].id;
    if (list.every((el) => el[0] !== newWord)) {
      list.push([newWord, idWord]);
    }
  }
  return list.sort(() => Math.random() - 0.5);
}
