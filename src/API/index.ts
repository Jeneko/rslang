import { Endpoints, Word } from 'types/index';

const SOURCE = 'https://team51-learnwords.herokuapp.com';

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

export async function getImage(path: string) {
  const url = `${SOURCE}/${path}`;
  return url;
}
