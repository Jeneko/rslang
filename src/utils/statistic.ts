import {
  getUserStatistic, updateUserStatistic, DEFAULT_WORDS_STAT, DEFAULT_GAME_STAT,
} from 'API/index';
import { WordsStatistic, GameStatistic, StatisticOptions } from 'types/index';

const MS_IN_DAY = 24 * 60 * 60 * 1000;

const DEFAULT_STAT: Record<keyof StatisticOptions, Omit<GameStatistic, 'date'> | Omit<WordsStatistic, 'date'>> = {
  words: DEFAULT_WORDS_STAT,
  sprint: DEFAULT_GAME_STAT,
  audiocall: DEFAULT_GAME_STAT,
};

// Get total qty of learned words
export async function getLearnedWords(): Promise<number> {
  const statistic = await getUserStatistic();
  return statistic ? statistic.learnedWords : 0;
}

// Set total qty of learned words
export async function setLearnedWords(learnedWords: number): Promise<boolean> {
  const statistic = await getUserStatistic();
  if (!statistic) return false;

  const updatedStatistic = { ...statistic, learnedWords };
  await updateUserStatistic(updatedStatistic);

  return true;
}

// Could be useful if you need to add or subtract some number of learned words
export async function changeLearnedWords(delta: number): Promise<boolean> {
  const statistic = await getUserStatistic();
  if (!statistic) return false;

  const learnedWords = Number(delta) + Number(statistic.learnedWords);
  const updatedStatistic = { ...statistic, learnedWords };
  await updateUserStatistic(updatedStatistic);

  return true;
}

// Get full words statistic
export async function getWordsStatistic(): Promise<WordsStatistic[] | false> {
  const statistic = await getUserStatistic();
  if (!statistic) return false;

  return statistic.optional.words;
}

// Set full words statistic
export async function setWordsStatistic(wordStat: WordsStatistic[]): Promise<WordsStatistic[] | false> {
  const statistic = await getUserStatistic();
  if (!statistic) return false;

  statistic.optional.words = wordStat;
  const updatedStatistic = await updateUserStatistic(statistic);

  return updatedStatistic.optional.words;
}

// Get full game statistic
export async function getGameStatistic(game: 'sprint' | 'audiocall'): Promise<GameStatistic[] | false> {
  const statistic = await getUserStatistic();
  if (!statistic) return false;

  return statistic.optional[game];
}

// Set full game statistic
export async function setGameStatistic(game: 'sprint' | 'audiocall', gameStat: GameStatistic[]): Promise<GameStatistic[] | false> {
  const statistic = await getUserStatistic();
  if (!statistic) return false;

  statistic.optional[game] = gameStat;
  const updatedStatistic = await updateUserStatistic(statistic);

  return updatedStatistic.optional[game];
}

// Get last <generic> statistic
export async function getLastStatistic<T>(statType: keyof StatisticOptions): Promise<T | false> {
  const statistic = await getUserStatistic();
  if (!statistic) return false;
  if (!statistic.optional[statType].length) return false;

  // Check date
  const curDate = new Date();
  const lastDate = statistic.optional[statType][statistic.optional[statType].length - 1].date;

  // If last stat is current day stat - return last stat
  if (curDate.getTime() - lastDate.getTime() < MS_IN_DAY) {
    return statistic.optional[statType][statistic.optional[statType].length - 1] as unknown as T;
  }

  // If last stat is yesterday stat - create new stat and return it
  const newStat = { date: curDate, ...DEFAULT_STAT[statType] };
  return newStat as unknown as T;
}

// Update last <generic> statistic
export async function updateStatistic<T>(statType: keyof StatisticOptions, myStat: Partial<Omit<T, 'date'>>): Promise<T | false> {
  const statistic = await getUserStatistic();
  if (!statistic) return false;
  if (!statistic.optional[statType].length) return false;

  let stat = statistic.optional[statType][statistic.optional[statType].length - 1];
  stat = { ...stat, ...myStat };
  statistic.optional[statType][statistic.optional[statType].length - 1] = stat;

  const returnedStat = await updateUserStatistic(statistic);
  return returnedStat.optional[statType][statistic.optional.words.length - 1] as unknown as T;
}
