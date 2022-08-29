import { createUserWord, updateUserWord } from 'API/index';
import { UserWord, WordStatus } from 'types/index';
import { sprintState } from './sprint-state';

export const createUpdateRightWord = async (id: string) => {
  const word = sprintState.userWords.find((currWord) => currWord.wordId === id);

  if (word) {
    const wordData: UserWord = {
      difficulty: word.optional.guessedInRow >= 2 ? WordStatus.learned : word.difficulty,
      optional: {
        guessedRight: (word.optional.guessedRight += 1),
        guessedWrong: word.optional.guessedWrong,
        guessedInRow: (word.optional.guessedInRow += 1),
      },
    };
    await updateUserWord(id, wordData);
  } else {
    const wordData: UserWord = {
      difficulty: WordStatus.default,
      optional: {
        guessedRight: 1,
        guessedWrong: 0,
        guessedInRow: 1,
      },
    };
    await createUserWord(id, wordData);
  }
};

export const createUpdateWrongWord = async (id: string) => {
  const word = sprintState.userWords.find((currWord) => currWord.wordId === id);

  if (word) {
    const wordData: UserWord = {
      difficulty: word.difficulty === WordStatus.hard ? WordStatus.hard : WordStatus.default,
      optional: {
        guessedRight: word.optional.guessedRight,
        guessedWrong: (word.optional.guessedWrong += 1),
        guessedInRow: 0,
      },
    };
    await updateUserWord(id, wordData);
  } else {
    const wordData: UserWord = {
      difficulty: WordStatus.default,
      optional: {
        guessedRight: 0,
        guessedWrong: 1,
        guessedInRow: 0,
      },
    };
    await createUserWord(id, wordData);
  }
};
