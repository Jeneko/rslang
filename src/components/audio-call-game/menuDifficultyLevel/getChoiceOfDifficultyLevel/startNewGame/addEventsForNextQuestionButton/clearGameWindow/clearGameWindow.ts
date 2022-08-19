export default function clearGameWindow() {
  const gameWindow = document.querySelector('.game-window');
  while (gameWindow?.firstChild) {
    gameWindow.firstChild.remove();
  }
}
