import startNewGame from './startNewGame/game';

export default async function getChoiceOfDifficultyLevel(elem: HTMLElement) {
  const menuLevels = elem.querySelector('.btn-group');
  const levelValue = menuLevels?.addEventListener('click', startNewGame);
  return levelValue;
}
