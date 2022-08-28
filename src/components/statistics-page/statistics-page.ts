import getStatPage from 'components/statistics-info/statistics-info';
import './statistics-page.css';

export default async function getStatisticsPage() {
  const elem = document.createElement('div');
  elem.append(await getStatPage());
  elem.classList.add('statistics-page', 'container');
  return elem;
}
