export default function choiceOfDifficultyLevel() {
  const menuLevels = document.querySelector('.btn-group');
  menuLevels?.addEventListener('click', (e) => {
    const { target } = e;
    if ((target as HTMLElement).classList.contains('btn-check')) {
      console.log((target as HTMLElement).dataset.level);
    }
  });
}
