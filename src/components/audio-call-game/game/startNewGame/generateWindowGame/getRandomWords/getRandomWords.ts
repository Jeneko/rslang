import { Word } from 'types/index';

export default function getRandomWords(currentWord: Word, listWords: Word[]): [string, string][] {
  let maxAmountAnswers = 5;
  const list: [string, string][] = [[currentWord.wordTranslate, currentWord.id]];
  if (maxAmountAnswers > listWords.length) {
    maxAmountAnswers = listWords.length;
  }
  while (list.length < maxAmountAnswers) {
    const randomIndex = Math.trunc(Math.random() * listWords.length);
    const newWord = listWords[randomIndex].wordTranslate;
    const idWord = listWords[randomIndex].id;
    if (list.every((el) => el[0] !== newWord)) {
      list.push([newWord, idWord]);
    }
  }
  return list.sort(() => Math.random() - 0.5);
}
