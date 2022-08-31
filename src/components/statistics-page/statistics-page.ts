import getStatPage from 'components/statistics-info/statistics-info-for-the-day';
import getFooter from 'components/footer/footer';
import { getAuth } from 'utils/auth';
import statisticsInfoAllDays from 'components/statistics-info/statistics-info-all-days';
import getSpinner from 'components/load-spinner/load-spinner';
import './statistics-page.css';

export default async function getStatisticsPage() {
  if (!getAuth()) {
    return noAuthUser();
  }
  const elem = document.createElement('div');
  const spinner = getSpinner();
  document.body.append(spinner);
  elem.append(await getStatPage());
  elem.append(await statisticsInfoAllDays());
  elem.append(getFooter());
  elem.classList.add('statistics-page');
  spinner.remove();
  return elem;
}

function noAuthUser() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('container');
  wrapper.innerHTML = '<p class="statistics-no-auth-user-info">Please, <a href="#login" class="load-page-link">Login</a> or <a href="#register" class="load-page-link">Register</a> to start using statistics.</p>';
  return wrapper;
}
