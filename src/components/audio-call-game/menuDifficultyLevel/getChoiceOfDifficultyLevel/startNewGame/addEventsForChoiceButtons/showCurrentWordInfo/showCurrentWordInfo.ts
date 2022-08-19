export default function showCurrentWordInfo() {
  const wordInfo = document.querySelector('.current-word-info');
  wordInfo?.classList.remove('current-word-info--hidden');
}
