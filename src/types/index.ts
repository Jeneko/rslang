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
  // TODO: add other pages if needed
}

export enum Endpoints {
  words = 'words',
  // TODO: add other endpoints
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
