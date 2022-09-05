import { getTodayStat } from 'utils/statistic';
import {
  WordsStatistic, GameStatistic, StatusCardStatistics, Statistic,
} from 'types/index';
import { ObjectStatisticsType } from './statistics.types';

enum HeaderName {
  WordsStatistics = 'Words statistics',
  AudioCall = 'Audio-call',
  Sprint = 'Sprint',
}

enum TitlesStatus {
  CardStatisticsWords = 'card-statistics-words',
  CardStatisticsAudio = 'card-statistics-audiocall',
  CardStatisticsSprint = 'card-statistics-sprint',
}

enum FiledValueCard {
  LearnedWords = 'Learned words',
  LongestSeries = 'Longest series',
}

export default async function getStatPage(respStatistics: Statistic): Promise<HTMLElement> {
  const page = document.createElement('div');
  page.classList.add('container', 'statistics-window');
  page.innerHTML = `
    <h1 class="page-heading"><span class="page-heading__rslang">RSLang</span> Statistics</h1>
  `;

  const windowsStatistics = await getWindowsStatistics(respStatistics);
  page.append(windowsStatistics);
  return page;
}

async function getWindowsStatistics(respStatistics: Statistic): Promise<HTMLElement> {
  const statistic = getObjectStatistic(respStatistics);

  const windowsStatistics = getCards(statistic, respStatistics.learnedWords);
  windowsStatistics.classList.add('statistics-block');

  const cardWords = windowsStatistics.querySelector('.card-statistics-words') as HTMLElement;
  const cardAudioCall = windowsStatistics.querySelector('.card-statistics-audiocall') as HTMLElement;
  const cardSprint = windowsStatistics.querySelector('.card-statistics-sprint') as HTMLElement;

  handleEventPaginationButtons(statistic.allStatWords as WordsStatistic[], cardWords, StatusCardStatistics.Word);
  handleEventPaginationButtons(statistic.allStatAudiocall as GameStatistic[], cardAudioCall, StatusCardStatistics.Game);
  handleEventPaginationButtons(statistic.allStatSprint as GameStatistic[], cardSprint, StatusCardStatistics.Game);
  return windowsStatistics;
}

function convertTimestampToDateStr(ms: number): string {
  const date = new Date(ms);
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

function handleEventPaginationButtons(allStatObject: WordsStatistic[] | GameStatistic[], cardBody: HTMLElement, key: StatusCardStatistics): void {
  const buttonLeft = cardBody.querySelector('.button-left') as HTMLElement;
  const buttonRight = cardBody.querySelector('.button-right') as HTMLElement;
  const dataTable = (cardBody.querySelector('.card-statistics-date') as HTMLElement);

  const learnWords = cardBody.querySelector('.game-statistic-info-learned') as HTMLElement || cardBody.querySelector('.game-statistic-info-longest-row') as HTMLElement;
  const newWords = cardBody.querySelector('.game-statistic-info-new-words') as HTMLElement;
  const rightAnswers = cardBody.querySelector('.game-statistic-info-right-answers') as HTMLElement;

  if (allStatObject.length <= 1) {
    buttonLeft.setAttribute('disabled', 'true');
  }

  buttonLeft.addEventListener('click', () => eventButtonPagination(false, allStatObject, dataTable, key, learnWords, newWords, rightAnswers, buttonRight, buttonLeft));
  buttonRight.addEventListener('click', () => eventButtonPagination(true, allStatObject, dataTable, key, learnWords, newWords, rightAnswers, buttonRight, buttonLeft));
}

function eventButtonPagination(
  flag: boolean,
  allStatObject: WordsStatistic[] | GameStatistic[],
  dataTable: HTMLElement,
  key: StatusCardStatistics,
  learnWords: HTMLElement,
  newWords: HTMLElement,
  rightAnswers: HTMLElement,
  buttonRight: HTMLElement,
  buttonLeft: HTMLElement,
): void {
  const lengthDate = allStatObject.length;
  const currentDateIndex = dataTable.dataset.dateindex as string;
  const newIndex = flag ? +(currentDateIndex) + 1 : +(currentDateIndex) - 1;

  const currentNewWords = (allStatObject[newIndex].newWordsQty).toString();
  const currentRightAnswers = (allStatObject[newIndex].rightAnswers).toString();

  if (key === StatusCardStatistics.Game) {
    const longestSeries = (allStatObject[newIndex] as GameStatistic).longestRow.toString();
    const { wrongAnswers } = allStatObject[newIndex];
    const percentCorrectAnswers = getPercentage(currentRightAnswers, wrongAnswers);

    rightAnswers.textContent = percentCorrectAnswers.toString();
    learnWords.textContent = longestSeries;
    newWords.textContent = currentNewWords;
  }

  if (key === StatusCardStatistics.Word) {
    const correctAnswers = allStatObject[newIndex].rightAnswers;
    const { wrongAnswers } = allStatObject[newIndex];
    const learnWordsAmount = (allStatObject[newIndex] as WordsStatistic).learnedWordsQty.toString();
    const currentLearn = getPercentage(correctAnswers, wrongAnswers).toString();

    rightAnswers.textContent = currentLearn;
    learnWords.textContent = learnWordsAmount;
    newWords.textContent = currentNewWords;
  }

  dataTable.dataset.dateindex = newIndex.toString();
  dataTable.innerHTML = `${convertTimestampToDateStr(allStatObject[newIndex].date)}`;

  if (flag) {
    if (newIndex === lengthDate - 1) {
      buttonRight.setAttribute('disabled', 'true');
    }
    if (newIndex > 0) {
      buttonLeft.removeAttribute('disabled');
    }
  } else {
    if (newIndex !== allStatObject.length - 1) {
      buttonRight.removeAttribute('disabled');
    }
    if (newIndex < 1) {
      buttonLeft.setAttribute('disabled', 'true');
    }
  }
}

function getPercentage(correct: string | number, wrong: string | number): number {
  const sum = +correct + +wrong;
  return sum ? Math.trunc((+correct / sum) * 100) : 0;
}

function getObjectStatistic(respStatistics: Statistic): ObjectStatisticsType {
  const statisticsForTodayWords = getTodayStat<WordsStatistic>(respStatistics, 'words');
  const statisticsForTodaySprint = getTodayStat<GameStatistic>(respStatistics, 'sprint');
  const statisticsForTodayAudioCall = getTodayStat<GameStatistic>(respStatistics, 'audiocall');

  const objStatistic = {
    allStatAudiocall: respStatistics.optional.audiocall.stat,
    allStatSprint: respStatistics.optional.sprint.stat,
    allStatWords: respStatistics.optional.words.stat,

    lengthAudiocall: respStatistics.optional.audiocall.stat.length,
    lengthSprint: respStatistics.optional.sprint.stat.length,
    lengthWords: respStatistics.optional.words.stat.length,

    wordsLearned: statisticsForTodayWords.learnedWordsQty,
    wordsNew: statisticsForTodayWords.newWordsQty,
    wordsRightAnswers: statisticsForTodayWords.rightAnswers,
    wordsPercentRightAnswers: getPercentage(statisticsForTodayWords.rightAnswers, statisticsForTodayWords.wrongAnswers),

    audiocallRightAnswers: statisticsForTodayAudioCall.rightAnswers,
    audiocallLongestRow: statisticsForTodayAudioCall.longestRow,
    audiocallNewWords: statisticsForTodayAudioCall.newWordsQty,
    audiocallWrongAnswers: statisticsForTodayAudioCall.wrongAnswers,
    audiocallPercentRightAnswers: getPercentage(statisticsForTodayAudioCall.rightAnswers, statisticsForTodayAudioCall.wrongAnswers),

    sprintRightAnswers: statisticsForTodaySprint.rightAnswers,
    sprintLongestRow: statisticsForTodaySprint.longestRow,
    sprintNewWords: statisticsForTodaySprint.newWordsQty,
    sprintWrongAnswers: statisticsForTodaySprint.wrongAnswers,
    sprintPercentRightAnswers: getPercentage(statisticsForTodaySprint.rightAnswers, statisticsForTodaySprint.wrongAnswers),
  };

  return objStatistic;
}

function getCards(respStatistics: ObjectStatisticsType, learnedWords: number) {
  const elem = document.createElement('div');
  elem.innerHTML = `
    <h2 class="statistics-title display-2">Statistics for words</h2>
      <div class="statistic-info-wrapper">
        <p class="statistic-info-of-day display-3">${learnedWords}</p>
        <h5 class="card-title display-5">
          Words learned
        </h5>
      </div>
    <h2 class="statistics-title display-2">Statistics for the day</h2>
  `;
  elem.classList.add('row');
  const wordsLength = respStatistics.allStatWords.length;
  const audioLength = respStatistics.allStatAudiocall.length;
  const sprintLength = respStatistics.allStatSprint.length;

  const words = respStatistics.allStatWords[wordsLength - 1];
  const audiocall = respStatistics.allStatAudiocall[audioLength - 1];
  const sprint = respStatistics.allStatSprint[sprintLength - 1];
  elem.append(getCard(words.newWordsQty, getPercentage(words.rightAnswers, words.wrongAnswers), words.learnedWordsQty, convertTimestampToDateStr(words.date), wordsLength, TitlesStatus.CardStatisticsWords, HeaderName.WordsStatistics, FiledValueCard.LearnedWords));
  elem.append(getCard(audiocall.newWordsQty, getPercentage(audiocall.rightAnswers, audiocall.wrongAnswers), audiocall.longestRow, convertTimestampToDateStr(audiocall.date), audioLength, TitlesStatus.CardStatisticsAudio, HeaderName.AudioCall, FiledValueCard.LongestSeries));
  elem.append(getCard(sprint.newWordsQty, getPercentage(sprint.rightAnswers, sprint.wrongAnswers), sprint.longestRow, convertTimestampToDateStr(sprint.date), sprintLength, TitlesStatus.CardStatisticsSprint, HeaderName.Sprint, FiledValueCard.LongestSeries));
  return elem;
}

function getCard(newWords: number, wordsPercentRightAnswers: number, wordsLearnedOrLongestRow: number, date: string, length: number, titleClass: TitlesStatus, title: HeaderName, fieldValue: FiledValueCard): HTMLElement {
  const card = document.createElement('div');
  card.classList.add('col-12', 'col-md-6', 'col-lg-4', 'statistic-block');
  card.innerHTML = `
    <div class="card card-statistics ${titleClass}">
      <div class="card-body">
        <h5 class="card-title card-title-statistics display-6">
          ${title}
        </h5>
        <div class="card-text-wrapper">
          <table class="statistic-table">
            <tr>
              <td class="statistic-td"><p class="card-text card-text-statistics">New words</p></td>
              <td class="statistic-td statistic-td-amount statistic-td-amount-second"><span class="game-statistic-first game-statistic-info game-statistic-info-new-words ">${newWords}</span></td>
            </tr>
            <tr>
              <td class="statistic-td"><p class="card-text card-text-statistics">Right answers (%)</p></td>
              <td class="statistic-td statistic-td-amount statistic-td-amount-third"><span class="game-statistic-second game-statistic-info game-statistic-info-right-answers">${wordsPercentRightAnswers}</span></td>
            </tr>
            <tr>
              <td class="statistic-td"><p class="card-text card-text-statistics">${fieldValue}</p></td>
              <td class="statistic-td statistic-td-amount statistic-td-amount-first"><span class="game-statistic-third game-statistic-info card-text game-statistic-info-learned">${wordsLearnedOrLongestRow}</span></td>
            </tr>
          </table>
          <div class="statistics-card-pagination d-flex justify-content-center align-items-center">
            <button type="button" class="btn btn-primary btn-sm button-left"><</button>
              <span data-dateindex="${length - 1}" class="card-statistics-date">${date}</span>
            <button disabled type="button" class="btn btn-primary btn-sm button-right">></button>
          </div>
        </div>
      </div>
    </div>
  `;
  return card;
}
