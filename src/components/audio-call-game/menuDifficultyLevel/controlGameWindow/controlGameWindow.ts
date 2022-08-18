export default function controlGameWindow(flag: boolean) {
  const gameWindow = document.querySelector('.game-window');
  if (flag) {
    gameWindow?.classList.remove('game-window-hidden');
  }
}
