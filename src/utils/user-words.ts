import {
  getWord, getWords, getAllUserWords, updateUserWord, createUserWord, getAggregatedWords,
} from 'API/index';
import {
  WordStatus, UserWordOptions, UserWord, WordWithUserWord,
} from 'types/index';

export const OPTIONAL_DEFAULTS: UserWordOptions = {
  guessedInRow: 0,
  guessedRight: 0,
  guessedWrong: 0,
};

export const USER_WORD_DEFAULTS: UserWord = {
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

export async function setWordStatusAndOptional(
  wordId: string,
  difficulty: WordStatus,
  optional: Partial<UserWordOptions>,
): Promise<void> {
  const userWords = await getAllUserWords();
  const userWord = userWords.find((word) => word.wordId === wordId);

  // If user word exists
  if (userWord) {
    const updatedUserWord = {
      difficulty,
      optional: { ...userWord.optional, ...optional },
    };
    await updateUserWord(wordId, updatedUserWord);

    return;
  }

  // If user word does not exist
  await createUserWord(wordId, {
    difficulty,
    optional: { ...OPTIONAL_DEFAULTS, ...optional },
  });
}

export async function getWordsWithUserData(group: number, page: number): Promise<WordWithUserWord[]> {
  const words = (await getWords(group, page)) as WordWithUserWord[];
  const userWords = await getAllUserWords();

  const wordsWithUserData = words.map((word) => {
    const userWord = userWords.find((curUserWord) => curUserWord.wordId === word.id);
    word.userWord = userWord || USER_WORD_DEFAULTS;
    return word;
  });

  return wordsWithUserData;
}

export async function getWordWithUserData(id: string): Promise<WordWithUserWord> {
  const word = (await getWord(id)) as WordWithUserWord;
  const userWords = await getAllUserWords();
  const userWord = userWords.find((curUserWord) => curUserWord.wordId === word.id);

  word.userWord = userWord || USER_WORD_DEFAULTS;

  return word;
}

export async function getAllUserWordsWithData(): Promise<WordWithUserWord[]> {
  try {
    const aggregatedResults = await getAggregatedWords('{"userWord.difficulty": "hard"}', 1000);
    const userWordsWithData = aggregatedResults[0].paginatedResults;
    const tmp = userWordsWithData.map((el) => {
      // eslint-disable-next-line no-underscore-dangle
      el.id = el._id as string;
      return el;
    });
    return tmp;
  } catch {
    return [];
  }
}
