import { Word } from 'types/index';
import { GetRandomWordsType } from './getRandomWords.types';

export default function getRandomWords(currentWord: Word, listWords: Word[]): GetRandomWordsType[] {
  const list: GetRandomWordsType[] = [[currentWord.wordTranslate, currentWord.id]];
  while (list.length < 5) {
    const randomIndex = Math.trunc(Math.random() * 20);
    const newWord = listWords[randomIndex].wordTranslate;
    const idWord = listWords[randomIndex].id;
    if (list.every((el) => el[0] !== newWord)) {
      list.push([newWord, idWord]);
    }
  }
  return list.sort(() => Math.random() - 0.5);
}
