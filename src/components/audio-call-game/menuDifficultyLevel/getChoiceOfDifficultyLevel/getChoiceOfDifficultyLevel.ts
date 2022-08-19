import startNewGame from './startNewGame/startNewGame';

export default async function getChoiceOfDifficultyLevel(elem: HTMLElement) {
  const menuLevels = elem.querySelector('.btn-group');
  const levelValue = menuLevels?.addEventListener('click', startNewGame);
  console.log(levelValue);
  return levelValue;
}
