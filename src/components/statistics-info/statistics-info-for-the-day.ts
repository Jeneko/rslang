import { getTodayStat } from 'utils/statistic';
import { getUserStatistic } from 'API/index';
import {
  WordsStatistic, GameStatistic, StatusCardStatistics, Statistic,
} from 'types/index';
import { ObjectStatisticsType } from './statistics.types';

export default async function getStatPage(): Promise<HTMLElement> {
  const page = document.createElement('div');
  page.classList.add('container', 'statistics-window');
  page.innerHTML = `
    <h1 class="page-heading"><span class="page-heading__rslang">RSLang</span> Statistics</h1>
  `;
  const windowsStatistics = await getWindowsStatistics();
  page.append(windowsStatistics);
  return page;
}

async function getWindowsStatistics(): Promise<HTMLElement> {
  const respStatistics = await getUserStatistic();

  const statistic = getObjectStatistic(respStatistics);

  const windowsStatistics = document.createElement('div');
  windowsStatistics.classList.add('statistics-block');
  windowsStatistics.innerHTML = getStatisticsWindowToString(respStatistics, statistic);

  const cardWords = windowsStatistics.querySelector('.card-body-words') as HTMLElement;
  const cardAudioCall = windowsStatistics.querySelector('.card-body-audiocall') as HTMLElement;
  const cardSprint = windowsStatistics.querySelector('.card-body-sprint') as HTMLElement;

  handleEventPaginationButtons(statistic.allStatWords as WordsStatistic[], cardWords, StatusCardStatistics.Word);
  handleEventPaginationButtons(statistic.allStatAudiocall as GameStatistic[], cardAudioCall, StatusCardStatistics.Game);
  handleEventPaginationButtons(statistic.allStatSprint as GameStatistic[], cardSprint, StatusCardStatistics.Game);
  return windowsStatistics;
}

function convertTimestampToDateStr(ms: number): string {
  const date = new Date(ms);
  return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
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
  let currentLearn;

  if (key === StatusCardStatistics.Game) {
    currentLearn = ((allStatObject[newIndex] as GameStatistic).longestRow).toString();
    const { wrongAnswers } = allStatObject[newIndex];
    const percentCorrectAnswers = getPercentage(currentRightAnswers, wrongAnswers);

    learnWords.textContent = percentCorrectAnswers.toString();
  }

  if (key === StatusCardStatistics.Word) {
    currentLearn = ((allStatObject[newIndex] as WordsStatistic).learnedWordsQty).toString();
    learnWords.textContent = currentLearn;
  }
  newWords.textContent = currentNewWords;
  rightAnswers.textContent = currentRightAnswers;

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
  return sum ? Math.trunc((+correct / sum) * +wrong) : 0;
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
    <section class="statistics-section statistics-section-for-day">
      <h2 class="display-2">Statistics for words</h2>
        <div class="statistic-info-wrapper">
        <p class="statistic-info-of-day display-3">${respStatistics.learnedWords}</p>
        <h5 class="card-title display-5">
          Words learned
        </h5>
      </div>
      <h2 class="display-2">Statistics for the day</h2>
      <div class="row">
        <div class="card-block col-xl-4 col-12">
            <div class="card">
              <div class="card-body card-body-words">
                <h5 class="card-title card-title-statistics display-6">
                  Words statistics
                </h5>
                <div class="card-text-wrapper">
                  <p class="card-text card-text-statistics">Learned <span class="game-statistic-info-learned">${statistic.wordsLearned}</span> words.</p>
                  <p class="card-text card-text-statistics">New <span class="game-statistic-info-new-words">${statistic.wordsNew}</span> words.</p>
                  <p class="card-text card-text-statistics">Amount correct answers <span class="game-statistic-info-right-answers">${statistic.wordsRightAnswers}</span>.</p>
                </div>
                <div class="statistics-card-pagination d-flex justify-content-center align-items-center">
                  <button type="button" class="btn btn-primary btn-sm button-left"><</button>
                    <span data-dateindex="${statistic.lengthWords - 1}" class="card-statistics-date">${convertTimestampToDateStr(statistic.allStatWords[statistic.lengthWords - 1].date)}</span>
                  <button disabled type="button" class="btn btn-primary btn-sm button-right">></button>
                </div>
              </div>
            </div>
          </div>
        <div class="card-block col-xl-4 col-12">
          <div class="card">
            <div class="card-body card-body-audiocall">
              <h5 class="card-title card-title-statistics display-6">
                Audio-call
              </h5>
              <div class="card-text-wrapper">
                <p class="card-text card-text-statistics">Percent correctly answers <span class="game-statistic-info-right-answers">${statistic.audiocallPercentRightAnswers}</span> %.</p>
                <p class="card-text card-text-statistics">New <span class="game-statistic-info-new-words">${statistic.audiocallNewWords}</span> words.</p>
                <p class="card-text card-text-statistics">Longest series of correct answers <span class="game-statistic-info-longest-row">${statistic.audiocallLongestRow}</span>.</p>
              </div>
              <div class="statistics-card-pagination d-flex justify-content-center align-items-center">
                <button type="button" class="btn btn-primary btn-sm button-left"><</button>
                  <span data-dateindex="${statistic.lengthAudiocall - 1}" class="card-statistics-date card-statistics-audiocall-date">${convertTimestampToDateStr(statistic.allStatAudiocall[statistic.lengthAudiocall - 1].date)}</span>
                <button disabled type="button" class="btn btn-primary btn-sm button-right">></button>
              </div>
            </div>
          </div>
        </div>
        <div class="card-block col-xl-4 col-12">
          <div class="card">
            <div class="card-body card-body-sprint">
              <h5 class="card-title card-title-statistics display-6">
                Sprint
              </h5>
              <div class="card-text-wrapper">
                <p class="card-text card-text-statistics">Percent correctly answers <span class="game-statistic-info-right-answers">${statistic.sprintPercentRightAnswers}</span> %.</p>
                <p class="card-text card-text-statistics">New <span class="game-statistic-info-new-words">${statistic.sprintLongestRow}</span> words.</p>
                <p class="card-text card-text-statistics">Longest series of correct answers <span class="game-statistic-info-longest-row">${statistic.sprintNewWords}</span>.</p>
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
    <section>
  `;
  return elem;
}
