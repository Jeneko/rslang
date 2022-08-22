export default function showCurrentWordInfo(): void {
  const wordInfo = document.querySelector('.current-word-info');
  wordInfo?.classList.remove('current-word-info--hidden');
}
