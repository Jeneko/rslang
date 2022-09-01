import { createUserWord, updateUserWord } from 'API/index';
import { WordStatus } from 'types/index';
import { OPTIONAL_DEFAULTS } from 'utils/user-words';
import { sprintState } from './sprint-state';

export default async (id: string, isAnswerCorrect: boolean) => {
  const word = sprintState.userWords.find((currWord) => currWord.wordId === id);
  const userWord = {
    difficulty: word?.difficulty || WordStatus.default,
    optional: word?.optional || { ...OPTIONAL_DEFAULTS },
  };

  if (isAnswerCorrect) {
    userWord.difficulty = userWord.optional.guessedInRow >= 2 ? WordStatus.learned : userWord.difficulty;
    userWord.optional.guessedRight += 1;
    userWord.optional.guessedInRow += 1;
  } else {
    userWord.difficulty = userWord.difficulty === WordStatus.hard ? WordStatus.hard : WordStatus.default;
    userWord.optional.guessedWrong += 1;
    userWord.optional.guessedInRow = 0;
  }

  if (word) {
    await updateUserWord(id, userWord);
  } else {
    await createUserWord(id, userWord);
  }
};
