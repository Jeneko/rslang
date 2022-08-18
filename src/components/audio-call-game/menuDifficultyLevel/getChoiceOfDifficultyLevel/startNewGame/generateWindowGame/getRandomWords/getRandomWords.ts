import { Word } from '../../../../../../../types/index';

export default function getRandomWords(currentWord: string, listWords: Word[]) {
  const list = [currentWord];
  while (list.length < 5) {
    const randomIndex = Math.trunc(Math.random() * 20);
    const newWord = listWords[randomIndex].word;
    if (newWord !== currentWord) {
      list.push(newWord);
    }
  }
  return list.sort(() => Math.random() - 0.5);
}
