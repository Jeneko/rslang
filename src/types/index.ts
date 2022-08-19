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
  // TODO: add other pages if needed
}

export enum Endpoints {
  words = 'words',
  // TODO: add other endpoints
}

export interface Word {
  // TODO: write proper interface
}
