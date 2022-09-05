import { Word, WordWithUserWord } from 'types/index';

export default function getRandomWords(currentWord: Word, listWords: Word[] | WordWithUserWord[]): [string, string][] {
  let maxAmountAnswers = 5;
  // eslint-disable-next-line no-underscore-dangle
  const list: [string, string][] = [[currentWord.wordTranslate, currentWord.id || (currentWord as WordWithUserWord)._id as string]];
  if (maxAmountAnswers > listWords.length) {
    maxAmountAnswers = listWords.length;
  }
  while (list.length < maxAmountAnswers) {
    const randomIndex = Math.trunc(Math.random() * listWords.length);
    const newWord = listWords[randomIndex].wordTranslate;
    // eslint-disable-next-line no-underscore-dangle
    const idWord = listWords[randomIndex].id || (listWords[randomIndex] as WordWithUserWord)._id;
    if (list.every((el) => el[0] !== newWord)) {
      list.push([newWord, idWord as string]);
    }
  }
  return list.sort(() => Math.random() - 0.5);
}
