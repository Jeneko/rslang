import getStatPage from 'components/statistics-info/statistics-info-for-the-day';
import getFooter from 'components/footer/footer';
import { getAuth } from 'utils/auth';
import getStatisticInfoAllDays from 'components/statistics-info/statistics-info-all-days';
import { showLoadSpinner } from 'components/load-spinner/load-spinner';
import './statistics-page.css';
import { getUserStatistic } from 'API/index';

export default async function getStatisticsPage() {
  if (!getAuth()) {
    return noAuthUser();
  }
  const respStatistics = await getUserStatistic();
  const elem = document.createElement('div');
  showLoadSpinner(true);
  elem.append(await getStatPage(respStatistics));
  elem.append(await getStatisticInfoAllDays(respStatistics));
  elem.append(getFooter());
  elem.classList.add('statistics-page');
  showLoadSpinner(false);
  return elem;
}

function noAuthUser() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('container', 'statistic-no-auth');
  const noAuthWindow = document.createElement('div');
  wrapper.innerHTML = `
    <h1 class="page-heading">
      <span class="page-heading__rslang">RSLang</span> Statistic
    </h1>
    <p class="statistics-no-auth-user-info">Please, <a href="#login" class="load-page-link">Login</a> or <a href="#register" class="load-page-link">Register</a> to start using statistics.</p>
  `;
  noAuthWindow.append(wrapper);
  noAuthWindow.append(getFooter());
  return noAuthWindow;
}
