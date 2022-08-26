// import rsschoolLogoUrl from './rsschool-logo.svg';
import './about-app.css';
import svg from './learn.svg';

// Dummy function content (to be replaced)
export default function getAboutApp(): HTMLElement {
  const elem = document.createElement('div');
  elem.className = 'about-app';

  elem.innerHTML = `
    <div class="container text-center">
      <div class="row justify-content-around about-wrapper">
        <div class="col-sm-10 col-md-5 align-self-center about-wrapper--block">
          <h1 class="page-heading__rslang about-app--title display-2">RS Lang</h1>
          <h2 class="about-app--subtitle display-4">Learning English is very easy and fun!</h2>
          <p class="about-app--content">
            Memorize words using the dictionary and playing mini games,
            listen to pronunciation, study transcription, examples in sentences,
            analyze your achievements through detailed statistics and all this for free on RS Lang!
          </p>
        </div>
        <div class="col-sm-10 col-md-5 align-self-center about-wrapper--block">
          <img src="${svg}" class="about-wrapper--img" alt="background-image">
        </div>
      </div>
    </div>
  `;
  return elem;
}
