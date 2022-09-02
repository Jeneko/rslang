import { getStatisticChart, ChartType } from 'components/statistic-chart/statistic-chart';
import { Statistic } from 'types/index';

export default async function getStatisticInfoAllDays(statistic: Statistic) {
  const elem = document.createElement('div');
  elem.classList.add('statistics-section', 'container', 'statistics-section-for-all-time', 'statistics-window', 'container');
  const row = document.createElement('div');
  row.classList.add('row', 'statistics-all-days-wrapper', 'justify-content-between');

  elem.innerHTML = `
    <h2 class="display-2">Statistic for all time</h2>
  `;
  elem.classList.add('container', 'statistics-window');

  const newWords = await getStatisticChart(statistic, ChartType.NewWords);
  const learnWords = await getStatisticChart(statistic, ChartType.LearnedWords);

  newWords.classList.add('col', 'col-xl-5', 'col-12');
  learnWords.classList.add('col', 'col-xl-5', 'col-12');

  row.append(newWords);
  row.append(learnWords);
  elem.append(row);

  return elem;
}
