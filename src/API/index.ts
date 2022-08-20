import { Endpoints, Word } from 'types/index';

export const SOURCE = 'https://team51-learnwords.herokuapp.com';

export async function getWords(group: number, page: number): Promise<Word[]> {
  const url = `${SOURCE}/${Endpoints.words}?group=${group}&page=${page}`;
  const response = await fetch(url);
  const result = await response.json() as Array<Word>;

  return result;
}

export async function getWord(id: number): Promise<Word> {
  const url = `${SOURCE}/${Endpoints.words}/${id}`;
  const response = await fetch(url);
  const result = await response.json() as Word;

  return result;
}

export async function createUser(name: string, email: string, password: string): Promise<boolean> {
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

  return response.ok;
}
