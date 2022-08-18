import { State, PageName } from 'types/index';

const SALT = '_team51_k23hiahsf3';
const STATE_NAME = `state${SALT}`;

const DEFAULT_STATE: State = {
  page: PageName.main,
  // TODO: add other states data we may need (like paginations and stuff)
};

export function getState(): State {
  const stateString = localStorage.getItem(STATE_NAME);
  if (typeof stateString === 'string') {
    const state = JSON.parse(stateString);
    return state;
  }
  return DEFAULT_STATE;
}

export function saveState(state: State): void {
  localStorage.setItem(STATE_NAME, JSON.stringify(state));
}

export function updateState(key: string, value: string | number): void {
  const state = getState();
  saveState({ ...state, [key]: value });
}
