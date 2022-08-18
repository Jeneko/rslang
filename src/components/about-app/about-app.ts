import rsschoolLogoUrl from './rsschool-logo.svg';
import './about-app.css';

// Dummy function content (to be replaced)
export default function getAboutApp(): HTMLElement {
  const elem = document.createElement('div');
  elem.className = 'about-app';

  elem.innerHTML = `
    <img src="${rsschoolLogoUrl}">
    <br><br>
    <button class="btn btn-primary">Let's start</button>
  `;

  return elem;
}
