export type State = {
  page: PageName;
  // TODO: add other state data we may need (like paginations and stuff)
};

export enum PageName {
  main = 'main',
  audioCall = 'audio-call',
  sprint = 'sprint',
  dictionary = 'dictionary',
  stats = 'stats',
  team = 'team',
  // TODO: add other pages if needed
}

export enum Endpoints {
  words = 'words',
  files = 'files',
  // TODO: add other endpoints
}

export interface Word {
  audio: string;
  audioExample: string;
  audioMeaning: string;
  group: number;
  id: string;
  image: string;
  page: number;
  textExample: string;
  textExampleTranslate: string;
  textMeaning: string;
  textMeaningTranslate: string;
  transcription: string;
  word: string;
  wordTranslate: string;
}
