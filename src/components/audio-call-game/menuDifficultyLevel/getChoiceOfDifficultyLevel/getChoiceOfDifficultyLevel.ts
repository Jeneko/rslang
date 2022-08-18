import getLevel from './getLevel/getLevel';

export default function getChoiceOfDifficultyLevel() {
  const menuLevels = document.querySelector('.btn-group');
  const levelValue = menuLevels?.addEventListener('click', getLevel);
  console.log(levelValue);
}
