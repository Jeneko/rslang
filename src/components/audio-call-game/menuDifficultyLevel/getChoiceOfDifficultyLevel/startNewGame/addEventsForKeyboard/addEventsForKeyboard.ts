export default function addEventsForKeyboard() {
  const gamePage = document.querySelector('.audio-call-page') as HTMLElement;
  gamePage.focus();
  gamePage.addEventListener('keydown', (e) => {
    console.log(e.code);
  });
  gamePage.addEventListener('blur', () => {
    console.log('blur');
    gamePage.focus();
  });
  gamePage.addEventListener('focus', () => {
    console.log('focus');
  });
}
