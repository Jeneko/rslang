import { createUserWord, updateUserWord } from 'API/index';
import { UserWord, WordStatus } from 'types/index';
import { sprintState } from './sprint-state';

export const createUpdateRightWord = async (id: string) => {
  const word = sprintState.userWords.find((currWord) => currWord.wordId === id);

  if (word) {
    word.difficulty = word.optional.guessedInRow >= 2 ? WordStatus.learned : word.difficulty;
    word.optional.guessedRight += 1;
    word.optional.guessedInRow += 1;
    await updateUserWord(id, word);
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
    word.difficulty = word.difficulty === WordStatus.hard ? WordStatus.hard : WordStatus.default;
    word.optional.guessedWrong += 1;
    word.optional.guessedInRow = 0;
    await updateUserWord(id, word);
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
