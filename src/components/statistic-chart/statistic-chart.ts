import { Statistic } from 'types/index';
import './statistic-chart.css';

const INFO_TEXT = 'Choose column to&nbsp;see&nbsp;info';

type ChartData = { value: number; timeStamp: number };

export enum ChartType {
  NewWords = 'New&nbsp;words',
  LearnedWords = 'Learned&nbsp;words',
}

function getArrayOfPercsOfMax(array: number[]): number[] {
  const maxValue = Math.max(...array);

  return array.map((el) => (el * 100) / maxValue);
}

function getFormattedDateFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

function getChart(chartData: ChartData[]): HTMLElement {
  const elem = document.createElement('div');
  elem.className = 'chart';

  // Convert chart data to percent values
  const chartDataPerc = getArrayOfPercsOfMax(chartData.map((el) => el.value));

  // Add columns to the chart
  chartDataPerc.forEach((value, i) => {
    elem.innerHTML += `
      <div class="chart__column" style="height: ${value}%;" data-value="${chartData[i].value}" data-timestamp="${chartData[i].timeStamp}"></div>
    `;
  });

  // Add empty element at the end of short charts to make them look nice
  if (chartData.length < 3) {
    elem.innerHTML += '<div class="chart__column" style="height: 0;"></div>';
  }

  return elem;
}

function toggleChartColumnInfo(e: Event): void {
  const elem = e.currentTarget as HTMLElement;
  const infoTextElem = elem.querySelector('.statistic-chart__info-text') as HTMLElement;

  const target = e.target as HTMLElement;
  const infoText = target.classList.contains('chart__column')
    ? `Words: ${target.dataset.value} | Date: ${getFormattedDateFromTimestamp(Number(target.dataset.timestamp as string))}`
    : INFO_TEXT;
  infoTextElem.innerHTML = infoText;
}

function handleEvents(elem: HTMLElement): void {
  const infoTextElem = elem.querySelector('.statistic-chart__info-text') as HTMLElement;

  elem.addEventListener('click', toggleChartColumnInfo);
  elem.addEventListener('mouseover', toggleChartColumnInfo);
  elem.addEventListener('mouseleave', () => { infoTextElem.innerHTML = INFO_TEXT; });
}

export async function getStatisticChart(stat: Statistic, chartType: ChartType): Promise<HTMLElement> {
  const elem = document.createElement('div');
  elem.className = 'statistic-chart';

  const wordsStat = stat.optional.words.stat;

  const getChartData: Record<ChartType, () => ChartData[]> = {
    [ChartType.NewWords]: () => wordsStat.map((day) => ({ value: day.newWordsQty, timeStamp: day.date })),
    [ChartType.LearnedWords]: () => wordsStat.map((day) => ({ value: day.learnedWordsQty, timeStamp: day.date })),
  };

  const chartData = getChartData[chartType]();
  const chart = getChart(chartData);

  elem.innerHTML = `
    <h2 class="statistic-chart__heading">Chart | ${chartType}</h2>
    <div class="statistic-chart__info">
      <span class="statistic-chart__info-text">${INFO_TEXT}</span>
    </div>
  `;

  elem.append(chart);
  handleEvents(elem);

  return elem;
}
