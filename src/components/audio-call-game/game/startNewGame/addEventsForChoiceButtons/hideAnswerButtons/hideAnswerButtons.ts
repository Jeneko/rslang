export default function hideAnswerButtons() {
  const buttonsChoice = document.querySelectorAll('.btn-choice-of-answer');
  buttonsChoice.forEach((button) => {
    button.setAttribute('disabled', 'true');
  });
}
