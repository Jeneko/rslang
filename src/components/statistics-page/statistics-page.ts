import getStatPage from 'components/statistics-info/statistics-info';
import getFooter from 'components/footer/footer';
import './statistics-page.css';

export default async function getStatisticsPage() {
  const elem = document.createElement('div');
  elem.append(await getStatPage());
  elem.append(getFooter());
  elem.classList.add('statistics-page');
  return elem;
}
