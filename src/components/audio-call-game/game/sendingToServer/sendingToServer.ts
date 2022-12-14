import {
  getAggregatedWords, getUserStatistic, updateUserStatistic, updateUserWord,
} from 'API/index';
import {
  Word, WordWithUserWord, GameStatistic, WordStatus, WordsStatistic, Statistic, ResponseUserWord,
} from 'types/index';
import { getTodayStat } from 'utils/statistic';
import { GameState } from '../startNewGame/game.types';

const NUMBER_FOR_LEARNED_WORD = 3;
const NUMBER_OF_WORDS_TO_PLAY = 20;

export async function sendDataToServer(correctAnswersList: WordWithUserWord[], wrongAnswersList: WordWithUserWord[], gameState: GameState): Promise<void> {
  const userStatistics = await getUserStatistic();
  const gameStatistics = getTodayStat<GameStatistic>(userStatistics, 'audiocall');
  const wordStatistics = getTodayStat<WordsStatistic>(userStatistics, 'words');
  await updateWordStatistic(correctAnswersList, wrongAnswersList, wordStatistics);
  await updateGameStatistic(gameStatistics, wordStatistics, correctAnswersList, wrongAnswersList, gameState, userStatistics);
}

async function updateWordStatistic(correctAnswersList: WordWithUserWord[], wrongAnswersList: WordWithUserWord[], wordStatistics: WordsStatistic) {
  const arrayPromise: Promise<ResponseUserWord>[] = [];
  correctAnswersList.forEach(async (el) => {
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
    // eslint-disable-next-line no-underscore-dangle
    arrayPromise.push(updateUserWord(el.id || el._id as string, optionals));
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
    // eslint-disable-next-line no-underscore-dangle
    arrayPromise.push(updateUserWord(el.id || el._id as string, optionals));
  });
  await Promise.all(arrayPromise);
}

async function updateGameStatistic(gameStatistics: GameStatistic, wordStatistics: WordsStatistic, correctAnswersList: WordWithUserWord[], wrongAnswersList: WordWithUserWord[], gameState: GameState, userStatistics: Statistic) {
  userStatistics.learnedWords = wordStatistics.learnedWordsQty;
  userStatistics.optional.audiocall.stat[0].longestRow = gameStatistics.longestRow < gameState.longestStreakForGame ? gameState.longestStreakForGame : gameStatistics.longestRow;
  userStatistics.optional.audiocall.stat[0].rightAnswers += correctAnswersList.length;
  userStatistics.optional.audiocall.stat[0].wrongAnswers += wrongAnswersList.length;
  userStatistics.optional.audiocall.stat[0].newWordsQty += +gameState.newWords;
  userStatistics.optional.words.stat[0].newWordsQty += +gameState.newWords;
  userStatistics.optional.words.stat[0].rightAnswers += correctAnswersList.length;
  await updateUserStatistic(userStatistics);
}

export async function getAuthWords(currentLevel: string | number, currentPage: string | number): Promise<Word[]> {
  const words: Word[] = [];
  async function getMoreWords(level: number, page: number) {
    const filter = `{"$and":[{"userWord.difficulty": {"$not": {"$eq": "learned"}}},{"page":${page}},{"group": ${level}}]}`;
    const resp = await getAggregatedWords(filter, NUMBER_OF_WORDS_TO_PLAY);
    let result = resp[0].paginatedResults;
    if (words.length + result.length > NUMBER_OF_WORDS_TO_PLAY) {
      const length = words.length + result.length - NUMBER_OF_WORDS_TO_PLAY;
      result = result.splice(length);
    }
    words.push(...result);
    if (page - 1 >= 0 && words.length < NUMBER_OF_WORDS_TO_PLAY) {
      await getMoreWords(level, page - 1);
    }
  }
  await getMoreWords(+currentLevel, +currentPage);
  return words.flat(Infinity);
}
