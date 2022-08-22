export default function showButtonNextQuestion(): void {
  const buttonNextQuestion = document.querySelector('.btn-next-question');
  buttonNextQuestion?.classList.remove('btn--hidden');
}
