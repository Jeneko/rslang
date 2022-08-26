import { Auth } from 'types/index';

const SALT = '_team51_k23hiahsf3';
const AUTH_NAME = `auth${SALT}`;

export function saveAuth(auth: Auth): void {
  localStorage.setItem(AUTH_NAME, JSON.stringify(auth));
}

export function getAuth(): Auth | null {
  const authString = localStorage.getItem(AUTH_NAME);
  return typeof authString === 'string' ? JSON.parse(authString) : null;
}

export function updateAuth(key: string, value: string): void {
  const auth = getAuth();
  if (!auth) return;
  saveAuth({ ...auth, [key]: value });
}

export function deleteAuth(): void {
  localStorage.removeItem(AUTH_NAME);
}
