import {
  Endpoints, Word, User, ResponseError, Auth, StatusCode,
} from 'types/index';

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
