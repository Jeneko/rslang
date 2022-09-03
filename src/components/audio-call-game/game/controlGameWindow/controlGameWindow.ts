export default function controlGameWindow(): void {
  const gameWindow = document.querySelector('.game-window');
  const levelMenu = document.querySelector('.buttons-level-block');
  gameWindow?.classList.remove('game-window--hidden');
  levelMenu?.classList.add('buttons-level-block--hidden');
}
