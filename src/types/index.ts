export type State = {
  page: PageName;
  studyBookChapter: number;
  studyBookPage: number;
  // TODO: add other state data we may need (like paginations and stuff)
};

export enum PageName {
  main = 'main',
  audioCall = 'audio-call',
  sprint = 'sprint',
  studyBook = 'study-book',
  stats = 'stats',
  team = 'team',
  register = 'register',
  login = 'login',
  // TODO: add other pages if needed
}

export enum Endpoints {
  words = 'words',
  users = 'users',
  signin = 'signin',
  tokens = 'tokens',
  aggregatedWords = 'aggregatedWords',
  // TODO: add other endpoints
}

export enum AlertType {
  primary = 'primary',
  secondary = 'secondary',
  success = 'success',
  danger = 'danger',
  warning = 'warning',
  info = 'info',
  light = 'light',
  dark = 'dark',
}

export enum StatusCode {
  ok = 200,
  noContent = 204,
  expectationFailed = 417,
  unprocessableEntity = 422,
  badRequest = 400,
  unauthorized = 401,
  notFound = 404,
  forbidden = 403,
}

export enum WordStatus {
  default = 'default',
  learned = 'learned',
  hard = 'hard',
}

export interface Word {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

export interface AggregatedResults {
  paginatedResults: WordWithUserWord[];
  totalCount: { count: number }[];
}

export interface User {
  email: string;
  id: string;
  name: string;
}

export interface UserWord {
  difficulty: WordStatus;
  optional: UserWordOptions;
}

export interface WordWithUserWord extends Word {
  _id?: string;
  userWord: UserWord;
}

export interface UserWordOptions {
  guessedRight: number;
  guessedWrong: number;
  guessedInRow: number;
  // TODO: add other options if needed
}

export interface ResponseUserWord extends UserWord {
  id: string;
  wordId: string;
}

export interface ResponseError {
  errors: Error[];
  status: 'failed';
}

export interface Auth {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}
