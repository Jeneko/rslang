import { Word } from '../../../../../../../types/index';
import { GetRandomWordsType } from './getRandomWords.types';

export default function getRandomWords(currentWord: Word, listWords: Word[]) {
  const list: GetRandomWordsType[] = [[currentWord.word, currentWord.id]];
  while (list.length < 5) {
    const randomIndex = Math.trunc(Math.random() * 20);
    const newWord = listWords[randomIndex].word;
    const idWord = listWords[randomIndex].id;
    if (newWord !== currentWord.word) {
      list.push([newWord, idWord]);
    }
  }
  return list.sort(() => Math.random() - 0.5);
}
