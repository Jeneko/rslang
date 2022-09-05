import { getStatisticChart, ChartType } from 'components/statistic-chart/statistic-chart';
import { Statistic } from 'types/index';

export default async function getStatisticInfoAllDays(statistic: Statistic) {
  const elem = document.createElement('div');
  elem.classList.add('container', 'statistics-window', 'statistics-section-for-all-time');
  const row = document.createElement('div');
  const tableNew = document.createElement('div');
  const tableLearned = document.createElement('div');
  row.classList.add('row');

  elem.innerHTML = `
    <h2 class="statistics-title display-2">All time statistic</h2>
  `;
  elem.classList.add('container', 'statistics-window');

  const newWords = await getStatisticChart(statistic, ChartType.NewWords);
  const learnWords = await getStatisticChart(statistic, ChartType.LearnedWords);

  tableNew.classList.add('col', 'col-lg-6', 'col-12');
  tableLearned.classList.add('col', 'col-lg-6', 'col-12');

  tableNew.append(newWords);
  tableLearned.append(learnWords);

  row.append(tableNew);
  row.append(tableLearned);
  elem.append(row);

  return elem;
}
