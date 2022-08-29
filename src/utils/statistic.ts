import { DEFAULT_WORDS_STAT, DEFAULT_GAME_STAT } from 'API/index';
import {
  Statistic, WordsStatistic, GameStatistic, StatisticOptions,
} from 'types/index';

const MS_IN_DAY = 24 * 60 * 60 * 1000;

export default function getTodayStat<T extends GameStatistic | WordsStatistic>(statistic: Statistic, type: keyof StatisticOptions): T {
  // Check date
  const curDate = Date.now();
  const lastDate = statistic.optional[type].stat[statistic.optional[type].stat.length - 1].date;

  // If last stat is current day stat - return last stat
  if (curDate - lastDate < MS_IN_DAY) {
    return statistic.optional[type].stat[statistic.optional[type].stat.length - 1] as T;
  }

  // If last stat is yesterday stat - create new stat, add it to stat and return it
  let newStat;

  // TODO: find a good way to get rid of switch
  switch (type) {
    case 'words':
      newStat = { ...DEFAULT_WORDS_STAT, date: curDate };
      statistic.optional[type].stat.push(newStat);
      break;

    case 'audiocall':
    case 'sprint':
    default:
      newStat = { ...DEFAULT_GAME_STAT, date: curDate };
      statistic.optional[type].stat.push(newStat);
  }

  return newStat as T;
}
