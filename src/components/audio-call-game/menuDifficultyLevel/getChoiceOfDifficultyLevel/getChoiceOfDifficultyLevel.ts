import getLevel from './startNewGame/startNewGame';

export default async function getChoiceOfDifficultyLevel() {
  const menuLevels = document.querySelector('.btn-group');
  const levelValue = menuLevels?.addEventListener('click', getLevel);
  console.log(levelValue);
  return levelValue;
}
