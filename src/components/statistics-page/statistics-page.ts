import getStatPage from 'components/statistics-info/statistics-info-for-the-day';
import getFooter from 'components/footer/footer';
import { getAuth } from 'utils/auth';
import getStatisticInfoAllDays from 'components/statistics-info/statistics-info-all-days';
import { showLoadSpinner } from 'components/load-spinner/load-spinner';
import './statistics-page.css';

export default async function getStatisticsPage() {
  if (!getAuth()) {
    return noAuthUser();
  }
  const elem = document.createElement('div');
  showLoadSpinner(true);
  elem.append(await getStatPage());
  elem.append(await getStatisticInfoAllDays());
  elem.append(getFooter());
  elem.classList.add('statistics-page');
  showLoadSpinner(false);
  return elem;
}

function noAuthUser() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('container');
  wrapper.innerHTML = `
  <h1 class="page-heading">
    <span class="page-heading__rslang">RSLang</span> Statistic
  </h1>
  <p class="statistics-no-auth-user-info">Please, <a href="#login" class="load-page-link">Login</a> or <a href="#register" class="load-page-link">Register</a> to start using statistics.</p>`;
  return wrapper;
}
