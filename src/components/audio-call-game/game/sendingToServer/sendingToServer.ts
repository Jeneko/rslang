import {
  getAggregatedWords, getUserStatistic, updateUserStatistic, updateUserWord,
} from 'API/index';
import {
  Word, WordWithUserWord, GameStatistic, WordStatus, WordsStatistic,
} from 'types/index';
import getTodayStat from 'utils/statistic';
import { GameState } from '../startNewGame/game.types';

const NUMBER_FOR_LEARNED_WORD = 3;

export async function sendDataToServer(correctAnswersList: WordWithUserWord[], wrongAnswersList: WordWithUserWord[], gameState: GameState): Promise<void> {
  const userStatistics = await getUserStatistic();
  const gameStatistics = getTodayStat<GameStatistic>(userStatistics, 'audiocall');
  const wordStatistics = getTodayStat<WordsStatistic>(userStatistics, 'words');
  correctAnswersList.forEach((el) => {
    const optionals = {
      difficulty: el.userWord ? el.userWord.difficulty : WordStatus.default,
      optional: {
        guessedRight: el.userWord ? el.userWord.optional.guessedRight + 1 : 1,
        guessedWrong: el.userWord ? el.userWord.optional.guessedWrong : 0,
        guessedInRow: el.userWord ? el.userWord.optional.guessedInRow + 1 : 1,
      },
    };
    if (optionals.optional.guessedInRow >= NUMBER_FOR_LEARNED_WORD && optionals.difficulty !== WordStatus.learned) {
      optionals.difficulty = WordStatus.learned;
      wordStatistics.learnedWordsQty += 1;
    }
    updateUserWord(el._id as string, optionals);
  });
  wrongAnswersList.forEach((el) => {
    const optionals = {
      difficulty: el.userWord ? el.userWord.difficulty : WordStatus.default,
      optional: {
        guessedRight: el.userWord ? el.userWord.optional.guessedRight : 0,
        guessedWrong: el.userWord ? el.userWord.optional.guessedWrong + 1 : 1,
        guessedInRow: 0,
      },
    };
    if (optionals.difficulty === WordStatus.learned) {
      optionals.difficulty = WordStatus.default;
      wordStatistics.learnedWordsQty -= 1;
    }
    updateUserWord(el._id as string, optionals);
  });
  gameStatistics.newWordsQty += gameState.newWords;
  gameStatistics.longestRow = gameStatistics.longestRow < gameState.longestStreakForGame ? gameState.longestStreakForGame : gameStatistics.longestRow;
  gameStatistics.rightAnswers += correctAnswersList.length;
  gameStatistics.wrongAnswers += wrongAnswersList.length;
  wordStatistics.newWordsQty += gameState.newWords;
  wordStatistics.rightAnswers += correctAnswersList.length;
  await updateUserStatistic(userStatistics);
}

export async function getAuthWords(currentLevel: string | number, currentPage: string | number): Promise<Word[]> {
  const words: Word[] = [];
  async function getMoreWords(level: number, page: number) {
    const filter = `{"$and":[{"userWord.difficulty": {"$not": {"$eq": "learned"}}},{"page":${level}},{"group": ${page}}]}`;
    const resp = await getAggregatedWords(filter, 20);
    let result = resp[0].paginatedResults;
    if (words.length + result.length > 20) {
      const length = words.length + result.length - 20;
      result = result.splice(length);
    }
    words.push(...result);

    if (page > 0 && words.length < 20) {
      await getMoreWords(level, page - 1);
    }
  }
  await getMoreWords(+currentLevel, +currentPage);
  return words.flat(Infinity);
}
