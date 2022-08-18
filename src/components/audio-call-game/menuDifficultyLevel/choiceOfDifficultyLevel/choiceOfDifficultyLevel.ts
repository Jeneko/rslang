export default async function choiceOfDifficultyLevel() {
  const menuLevels = document.querySelector('.btn-group');
  console.log(menuLevels);
  menuLevels?.addEventListener('click', (e) => {
    console.log(e.target);
  });
}
