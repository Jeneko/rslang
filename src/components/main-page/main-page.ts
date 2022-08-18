import getAboutApp from 'components/about-app/about-app';
import getFooter from 'components/footer/footer';

export default function getMainPage(): HTMLElement {
  const elem = document.createElement('div');
  elem.className = 'main-page';

  elem.append(getAboutApp());
  elem.append(getFooter());

  return elem;
}
