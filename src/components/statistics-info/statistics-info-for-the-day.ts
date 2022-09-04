import { getTodayStat } from 'utils/statistic';
import {
  WordsStatistic, GameStatistic, StatusCardStatistics, Statistic,
} from 'types/index';
import { ObjectStatisticsType } from './statistics.types';

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

  const windowsStatistics = document.createElement('div');
  windowsStatistics.classList.add('statistics-block');
  windowsStatistics.innerHTML = getStatisticsWindowToString(respStatistics, statistic);

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
    const longestSeries = ((allStatObject[newIndex] as GameStatistic).longestRow).toString();
    const { wrongAnswers } = allStatObject[newIndex];
    const percentCorrectAnswers = getPercentage(currentRightAnswers, wrongAnswers);

    rightAnswers.textContent = percentCorrectAnswers.toString();
    learnWords.textContent = longestSeries;
    newWords.textContent = currentNewWords;
  }

  if (key === StatusCardStatistics.Word) {
    const currentLearn = ((allStatObject[newIndex] as WordsStatistic).learnedWordsQty).toString();
    rightAnswers.textContent = currentRightAnswers;
    learnWords.textContent = currentLearn;
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
    wordsPercentRightAnswers: getPercentage(
      (statisticsForTodayAudioCall.rightAnswers + statisticsForTodaySprint.rightAnswers),
      (statisticsForTodayAudioCall.wrongAnswers + statisticsForTodaySprint.wrongAnswers),
    ),

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

function getStatisticsWindowToString(respStatistics: Statistic, statistic: ObjectStatisticsType): string {
  const elem = `
    <div class="statistics-wrapper statistics-section-for-day">
      <h2 class="display-2">Statistics for words</h2>
        <div class="statistic-info-wrapper">
        <p class="statistic-info-of-day display-3">${respStatistics.learnedWords}</p>
        <h5 class="card-title display-5">
          Words learned
        </h5>
      </div>
      <h2 class="display-2">Statistics for the day</h2>
      <div class="row">
        <div class="col-12 col-lg-4">
          <div class="card card-statistics card-statistics-words">
            <div class="card-body">
              <h5 class="card-title card-title-statistics display-6">
                Words statistics
              </h5>
              <div class="card-text-wrapper">
                <table class="statistic-table">
                  <tr>
                    <td class="statistic-td"><p class="card-text card-text-statistics">New words</p></td>
                    <td class="statistic-td statistic-td-amount statistic-td-amount-second"><span class="game-statistic-first game-statistic-info game-statistic-info-new-words ">${statistic.wordsNew}</span></td>
                  </tr>
                  <tr>
                    <td class="statistic-td"><p class="card-text card-text-statistics">Right answers (%)</p></td>
                    <td class="statistic-td statistic-td-amount statistic-td-amount-third"><span class="game-statistic-second game-statistic-info game-statistic-info-right-answers">${statistic.wordsPercentRightAnswers}</span></td>
                  </tr>
                  <tr>
                    <td class="statistic-td"><p class="card-text card-text-statistics">Learned words</p></td>
                    <td class="statistic-td statistic-td-amount statistic-td-amount-first"><span class="game-statistic-third game-statistic-info card-text game-statistic-info-learned">${statistic.wordsLearned}</span></td>
                  </tr>
                </table>
                <div class="statistics-card-pagination d-flex justify-content-center align-items-center">
                  <button type="button" class="btn btn-primary btn-sm button-left"><</button>
                    <span data-dateindex="${statistic.lengthWords - 1}" class="card-statistics-date">${convertTimestampToDateStr(statistic.allStatWords[statistic.lengthWords - 1].date)}</span>
                  <button disabled type="button" class="btn btn-primary btn-sm button-right">></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-12">
          <div class="card card-statistics card-statistics-audiocall">
            <div class="card-body">
              <h5 class="card-title card-title-statistics display-6">
                Audio-call
              </h5>
              <div class="card-text-wrapper">
                <table class="statistic-table">
                  <tr>
                    <td class="statistic-td"><p class="card-text card-text-statistics">New words</p></td>
                    <td class="statistic-td statistic-td-amount statistic-td-amount-second"><span class="game-statistic-first game-statistic-info game-statistic-info-new-words">${statistic.audiocallNewWords}</span></td>
                  </tr>
                  <tr>
                    <td class="statistic-td"><p class="card-text card-text-statistics">Right answers (%)</p></td>
                    <td class="statistic-td statistic-td-amount"><span class="game-statistic-second game-statistic-info game-statistic-info-right-answers">${statistic.audiocallPercentRightAnswers}</span></td>
                  </tr>
                  <tr>
                    <td class="statistic-td"><p class="card-text card-text-statistics">Longest series</p></td>
                    <td class="statistic-td statistic-td-amount statistic-td-amount-third"><span class="game-statistic-third game-statistic-info game-statistic-info-longest-row">${statistic.audiocallLongestRow}</span></td>
                  </tr>
                </table>
              </div>
              <div class="statistics-card-pagination d-flex justify-content-center align-items-center">
                <button type="button" class="btn btn-primary btn-sm button-left"><</button>
                  <span data-dateindex="${statistic.lengthAudiocall - 1}" class="card-statistics-date card-statistics-audiocall-date">${convertTimestampToDateStr(statistic.allStatAudiocall[statistic.lengthAudiocall - 1].date)}</span>
                <button disabled type="button" class="btn btn-primary btn-sm button-right">></button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-12">
          <div class="card card-statistics card-statistics-sprint">
            <div class="card-body">
              <h5 class="card-title card-title-statistics display-6">
                Sprint
              </h5>
              <div class="card-text-wrapper">
                <table class="statistic-table">
                  <tr>
                    <td class="statistic-td"><p class="card-text card-text-statistics">New words</p></td>
                    <td class="statistic-td statistic-td-amount statistic-td-amount-second"><span class="game-statistic-first game-statistic-info game-statistic-info-new-words">${statistic.sprintNewWords}</span></td>
                  </tr>
                  <tr>
                    <td class="statistic-td"><p class="card-text card-text-statistics">Right answers (%)</p></td>
                    <td class="statistic-td statistic-td-amount statistic-td-amount-first"><span class="game-statistic-second game-statistic-info game-statistic-info-right-answers">${statistic.sprintPercentRightAnswers}</span></td>
                  </tr>
                  <tr>
                    <td class="statistic-td"><p class="card-text card-text-statistics">Longest series</p></td>
                    <td class="statistic-td statistic-td-amount statistic-td-amount-third"><span class="game-statistic-third game-statistic-info game-statistic-info-longest-row">${statistic.sprintLongestRow}</span></td>
                  </tr>
                </table>
              </div>
              <div class="statistics-card-pagination d-flex justify-content-center align-items-center">
                <button type="button" class="btn btn-primary btn-sm button-left"><</button>
                  <span data-dateindex="${statistic.lengthSprint - 1}" class="card-statistics-date card-statistics-sprint-date">${convertTimestampToDateStr(statistic.allStatSprint[statistic.lengthSprint - 1].date)}</span>
                <button disabled type="button" class="btn btn-primary btn-sm button-right">></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  return elem;
}
