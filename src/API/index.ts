import * as auth from 'utils/auth';
import {
  Endpoints, Word, User, ResponseError, Auth, StatusCode, UserWord,
  ResponseUserWord, AggregatedResults, Statistic, WordsStatistic, GameStatistic,
} from 'types/index';

export const SOURCE = 'https://team51-learnwords.herokuapp.com';
export const WORDS_PER_PAGE_DEFAULTS = 20;

export const DEFAULT_WORDS_STAT: WordsStatistic = {
  date: 0,
  learnedWordsQty: 0,
  newWordsQty: 0,
  rightAnswers: 0,
};

export const DEFAULT_GAME_STAT: GameStatistic = {
  date: 0,
  longestRow: 0,
  newWordsQty: 0,
  rightAnswers: 0,
};

export async function getWords(group: number, page: number): Promise<Word[]> {
  const url = `${SOURCE}/${Endpoints.words}?group=${group}&page=${page}`;
  const response = await fetch(url);
  const result = await response.json() as Array<Word>;

  return result;
}

export async function getWord(id: string): Promise<Word> {
  const url = `${SOURCE}/${Endpoints.words}/${id}`;
  const response = await fetch(url);
  const result = await response.json() as Word;

  return result;
}

export async function createUser(name: string, email: string, password: string): Promise<ResponseError | User> {
  const url = `${SOURCE}/${Endpoints.users}`;
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  };

  const response = await fetch(url, options);

  // Expectation Failed (User already exists)
  if (response.status === StatusCode.expectationFailed) {
    const errorText = await response.text();

    return {
      errors: [new Error(errorText)],
      status: 'failed',
    };
  }

  // Unprocessable Entity (Wrong email or password format)
  if (response.status === StatusCode.unprocessableEntity) {
    const result = await response.json();
    return result.error as ResponseError;
  }

  const result = await response.json();

  return result as User;
}

export async function loginUser(email: string, password: string): Promise<ResponseError | Auth> {
  const url = `${SOURCE}/${Endpoints.signin}`;
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
    }),
  };

  const response = await fetch(url, options);

  // Not found OR Forbidden (Wrong email or password)
  if (response.status === StatusCode.notFound || response.status === StatusCode.forbidden) {
    const errorText = await response.text();
    // Error text from response is bad formatted so we format it
    const formattedErrorText = getFormattedErrorText(errorText);

    return {
      errors: [new Error(formattedErrorText)],
      status: 'failed',
    };
  }

  const result = await response.json();

  return result as Auth;
}

export async function updateToken(): Promise<void> {
  const curAuth = auth.getAuth();
  if (!curAuth) throw new Error('No Auth found');

  const url = `${SOURCE}/${Endpoints.users}/${curAuth.userId}/${Endpoints.tokens}`;
  const options = {
    headers: {
      Authorization: `Bearer ${curAuth.refreshToken}`,
    },
  };

  const response = await fetch(url, options);

  // Handle bad response
  if (response.status === StatusCode.forbidden) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const newTokens = await response.json() as Pick<Auth, 'token' | 'refreshToken'>;

  auth.updateAuth('token', newTokens.token);
  auth.updateAuth('refreshToken', newTokens.refreshToken);
}

export async function createUserWord(wordId: string, word: UserWord): Promise<ResponseUserWord> {
  const curAuth = auth.getAuth();
  if (!curAuth) throw new Error('No Auth found');

  const url = `${SOURCE}/${Endpoints.users}/${curAuth.userId}/${Endpoints.words}/${wordId}`;
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(word),
  };

  const response = await authFetch(url, options);

  // Handle bad responses
  if (response.status === StatusCode.badRequest || response.status === StatusCode.expectationFailed) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const result = await response.json() as ResponseUserWord;
  return result;
}

export async function getUserWord(wordId: string): Promise<ResponseUserWord | false> {
  const curAuth = auth.getAuth();
  if (!curAuth) throw new Error('No Auth found');

  const url = `${SOURCE}/${Endpoints.users}/${curAuth.userId}/${Endpoints.words}/${wordId}`;
  const response = await authFetch(url);

  // If User Word is not found
  if (response.status === StatusCode.notFound) {
    return false;
  }

  const result = await response.json() as ResponseUserWord;
  return result;
}

export async function getAllUserWords(): Promise<ResponseUserWord[]> {
  const curAuth = auth.getAuth();
  if (!curAuth) return [];

  const url = `${SOURCE}/${Endpoints.users}/${curAuth.userId}/${Endpoints.words}`;
  const response = await authFetch(url);

  const result = await response.json() as ResponseUserWord[];
  return result;
}

export async function updateUserWord(wordId: string, word: UserWord): Promise<ResponseUserWord> {
  const curAuth = auth.getAuth();
  if (!curAuth) throw new Error('No Auth found');

  const url = `${SOURCE}/${Endpoints.users}/${curAuth.userId}/${Endpoints.words}/${wordId}`;
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(word),
  };

  const response = await authFetch(url, options);

  // Handle bad responses
  if (response.status === StatusCode.notFound) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const result = await response.json() as ResponseUserWord;
  return result;
}

export async function deleteUserWord(wordId: string): Promise<void> {
  const curAuth = auth.getAuth();
  if (!curAuth) throw new Error('No Auth found');

  const url = `${SOURCE}/${Endpoints.users}/${curAuth.userId}/${Endpoints.words}/${wordId}`;
  const options = { method: 'DELETE' };

  await authFetch(url, options);
}

export async function getAggregatedWords(filter?: string, wordsPerPage: number = WORDS_PER_PAGE_DEFAULTS, group?: number, page?: number): Promise<AggregatedResults[]> {
  const curAuth = auth.getAuth();
  if (!curAuth) throw new Error('No Auth found');

  const url = new URL(`${SOURCE}/${Endpoints.users}/${curAuth.userId}/${Endpoints.aggregatedWords}`);

  url.searchParams.set('wordsPerPage', String(wordsPerPage));
  if (filter) url.searchParams.set('filter', filter);
  if (group !== undefined) url.searchParams.set('group', String(group));
  if (page !== undefined) url.searchParams.set('page', String(page));

  const response = await authFetch(url);

  // Handle bad responses
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const result = await response.json() as AggregatedResults[];

  return result;
}

export async function getAggregatedWord(wordId: string): Promise<Word> {
  const curAuth = auth.getAuth();
  if (!curAuth) throw new Error('No Auth found');

  const url = new URL(`${SOURCE}/${Endpoints.users}/${curAuth.userId}/${Endpoints.aggregatedWords}/${wordId}`);

  const response = await authFetch(url);
  const result = await response.json();

  return result[0] as Word;
}

async function authFetch(url: RequestInfo | URL, options?: RequestInit | undefined): Promise<Response> {
  let curAuth = auth.getAuth();
  if (!curAuth) { throw new Error('No Auth found!'); }

  let optionsWithAuth = addAuthToOptions(curAuth.token, options);
  let response = await fetch(url, optionsWithAuth);

  // If access token is missing or invalid
  if (response.status === StatusCode.unauthorized) {
    await updateToken();
    curAuth = auth.getAuth() as Auth;

    optionsWithAuth = addAuthToOptions(curAuth.token, options);
    response = await fetch(url, optionsWithAuth);
  }

  return response;
}

export async function getUserStatistic(): Promise<Statistic> {
  const curAuth = auth.getAuth();
  if (!curAuth) throw new Error('Can\'t get statistic: No Auth found');

  const url = `${SOURCE}/${Endpoints.users}/${curAuth.userId}/${Endpoints.statistics}`;

  const response = await authFetch(url);

  // IF user has no statistic yet
  if (response.status === StatusCode.notFound) {
    // Create, save and return default statistic
    return updateUserStatistic(createNewUserStatistic());
  }

  const result = await response.json() as Statistic;

  return result;
}

export async function updateUserStatistic(statistic: Statistic): Promise<Statistic> {
  const curAuth = auth.getAuth();
  if (!curAuth) throw new Error('Can\'t update statistic: No Auth found');

  // We must do this because server doesn't allow this prop in JSON object,
  // but getUserStatistic returns object with this param so we must delete it
  delete statistic.id;

  const url = `${SOURCE}/${Endpoints.users}/${curAuth.userId}/${Endpoints.statistics}`;
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(statistic),
  };

  const response = await authFetch(url, options);

  // Handle bad responses
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }

  const result = await response.json() as Statistic;
  return result;
}

function addAuthToOptions(token: string, options?: RequestInit | undefined) :RequestInit {
  const newHeaders = { ...options?.headers, Authorization: `Bearer ${token}` };
  const optionsWithAuth = { ...options };
  optionsWithAuth.headers = newHeaders;
  return optionsWithAuth;
}

function getFormattedErrorText(errorText: string): string {
  let formattedErrorText = errorText;

  // FROM [1] TO [2]
  // [1] Error: Couldn't find a(an) user with: {"email":"asd@asdf"}
  // [2] Error: Couldn't find a(an) user with: email: asd@asdf
  if (formattedErrorText.search('email') !== -1) {
    formattedErrorText = formattedErrorText.replaceAll(/[{""}]/g, '');
    formattedErrorText = formattedErrorText.replace('email:', 'email: ');
  }

  // FROM [1] TO [2]
  // [1] Error: Forbidden
  // [2] Error: wrong password!
  if (formattedErrorText.search('Forbidden') !== -1) {
    formattedErrorText = 'wrong password :(';
  }

  return formattedErrorText;
}

// Create brand new statisic
function createNewUserStatistic(): Statistic {
  const newStatistic: Statistic = {
    learnedWords: 0,
    optional: {
      words: { stat: [{ ...DEFAULT_WORDS_STAT, date: Date.now() }] },
      sprint: { stat: [{ ...DEFAULT_GAME_STAT, date: Date.now() }] },
      audiocall: { stat: [{ ...DEFAULT_GAME_STAT, date: Date.now() }] },
    },
  };

  return newStatistic;
}
