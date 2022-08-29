export default function controlGameWindow(): void {
  const gameWindow = document.querySelector('.game-window');
  const levelMenu = document.querySelector('.level-menu');
  gameWindow?.classList.remove('game-window--hidden');
  levelMenu?.classList.add('level-menu--hidden');
}
