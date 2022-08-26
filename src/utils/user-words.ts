import {
  getWords, getAllUserWords, updateUserWord, createUserWord,
} from 'API/index';
import {
  WordStatus, UserWordOptions, Word, UserWord,
} from 'types/index';

const OPTIONAL_DEFAULTS: UserWordOptions = {
  guessedInRow: 0,
  guessedRight: 0,
  guessedWrong: 0,
};

const USER_WORD_DEFAULTS: UserWord = {
  difficulty: WordStatus.default,
  optional: OPTIONAL_DEFAULTS,
};

export async function setWordStatus(wordId: string, difficulty: WordStatus): Promise<void> {
  const userWords = await getAllUserWords();
  const userWord = userWords.find((word) => word.wordId === wordId);

  // If user word exists
  if (userWord) {
    const updatedUserWord = {
      difficulty,
      optional: { ...userWord.optional },
    };
    await updateUserWord(wordId, updatedUserWord);

    return;
  }

  // If user word does not exist
  await createUserWord(wordId, {
    difficulty,
    optional: { ...OPTIONAL_DEFAULTS },
  });
}

export async function setWordOptional(wordId: string, optional: Partial<UserWordOptions>): Promise<void> {
  const userWords = await getAllUserWords();
  const userWord = userWords.find((word) => word.wordId === wordId);

  // If user word exists
  if (userWord) {
    const updatedUserWord = {
      difficulty: userWord.difficulty,
      optional: { ...userWord.optional, ...optional },
    };
    await updateUserWord(wordId, updatedUserWord);

    return;
  }

  // If user word does not exist
  await createUserWord(wordId, {
    difficulty: WordStatus.default,
    optional: { ...OPTIONAL_DEFAULTS, ...optional },
  });
}

export async function getWordsWithUserData(group: number, page: number): Promise<(Word & UserWord)[]> {
  const words = await getWords(group, page);
  const userWords = await getAllUserWords();

  const wordsWithUserData = words.map((word) => {
    const userWord = userWords.find((curUserWord) => curUserWord.wordId === word.id);
    return userWord ? { ...userWord, ...word } : { ...word, ...USER_WORD_DEFAULTS };
  });

  return wordsWithUserData;
}
