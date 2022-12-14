import { getAllUserWords, getUserStatistic, updateUserStatistic } from 'API/index';
import {
  GameStatistic, ResponseUserWord, WordsStatistic, WordStatus,
} from 'types/index';
import { getTodayStat } from 'utils/statistic';
import { sprintState } from './sprint-state';

export default async (): Promise<void> => {
  const userWords = await getAllUserWords();
  const userStat = await getUserStatistic();
  const wordStat = getTodayStat<WordsStatistic>(userStat, 'words');
  const gameStat = getTodayStat<GameStatistic>(userStat, 'sprint');

  const learnedWords = getLearnedWordsNumber(userWords);
  const newWordsQty = getNewWordsQty(userWords);
  const rightAnswers = sprintState.rightAnswers.length;
  const wrongAnswers = sprintState.wrongAnswers.length;
  const { longestRow } = sprintState.session;

  userStat.learnedWords = userStat.learnedWords + learnedWords < 0 ? 0 : userStat.learnedWords + learnedWords;

  wordStat.newWordsQty += newWordsQty;
  wordStat.learnedWordsQty = wordStat.learnedWordsQty + learnedWords < 0 ? 0 : wordStat.learnedWordsQty + learnedWords;
  wordStat.rightAnswers += rightAnswers;
  wordStat.wrongAnswers += wrongAnswers;

  gameStat.longestRow = gameStat.longestRow > longestRow ? gameStat.longestRow : longestRow;
  gameStat.newWordsQty += newWordsQty;
  gameStat.rightAnswers += rightAnswers;
  gameStat.wrongAnswers += wrongAnswers;

  await updateUserStatistic(userStat);
};

const getLearnedWords = (wordArray: ResponseUserWord[]): ResponseUserWord[] => wordArray.filter((word) => word.difficulty === WordStatus.learned);

const getLearnedWordsNumber = (userWords: ResponseUserWord[]): number => {
  const learnedWordsBeforeGame = getLearnedWords(sprintState.userWords);
  const learnedWordsAfterGame = getLearnedWords(userWords);
  return learnedWordsAfterGame.length - learnedWordsBeforeGame.length;
};

const getUserWordsId = (wordArray: ResponseUserWord[]) => wordArray.map((word) => word.wordId);

const getNewWordsQty = (userWords: ResponseUserWord[]): number => {
  const userWordsIdBeforeGame = getUserWordsId(sprintState.userWords);
  const userWordsIdAfterGame = getUserWordsId(userWords);
  return userWordsIdAfterGame.filter((id) => !userWordsIdBeforeGame.includes(id)).length;
};
