import {
  getWords, getAllUserWords, updateUserWord, createUserWord,
} from 'API/index';
import {
  Difficulty, UserWordOptions, Word, UserWord,
} from 'types/index';

const OPTIONAL_DEFAULTS: UserWordOptions = {
  guessedInRow: 0,
  guessedRight: 0,
  guessedWrong: 0,
  learned: false,
};

const USER_WORD_DEFAULTS: UserWord = {
  difficulty: Difficulty.easy,
  optional: OPTIONAL_DEFAULTS,
};

export async function setWordDifficulty(wordId: string, difficulty: Difficulty): Promise<void> {
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
    difficulty: Difficulty.easy,
    optional: { ...OPTIONAL_DEFAULTS, ...optional },
  });
}

export async function setWordLearned(wordId: string, learned: boolean): Promise<void> {
  await setWordOptional(wordId, { learned });
}

export async function getWordsWithUserData(group: number, page: number): Promise<(Word & UserWord)[]> {
  const words = await getWords(group, page);
  const userWords = await getAllUserWords();

  const wordsWithUserData = words.map((word) => {
    const userWord = userWords.find((curUserWord) => curUserWord.wordId === word.id);
    return userWord ? { ...word, ...userWord } : { ...word, ...USER_WORD_DEFAULTS };
  });

  return wordsWithUserData;
}
