export default function controlGameWindow(statusGame: boolean): void {
  const gameWindow = document.querySelector('.game-window');
  const levelMenu = document.querySelector('.level-menu');
  if (statusGame) {
    gameWindow?.classList.remove('game-window--hidden');
    levelMenu?.classList.add('level-menu--hidden');
  }
}
