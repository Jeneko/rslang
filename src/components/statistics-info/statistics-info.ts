import getTodayStat from 'utils/statistic';
import { getUserStatistic } from 'API/index';
import { WordsStatistic, GameStatistic } from 'types/index';
import { getAuth } from 'utils/auth';

export default async function getStatPage() {
  const page = document.createElement('div');
  page.classList.add('container', 'statistics-window');
  page.innerHTML = `
    <h1 class="page-heading"><span class="page-heading__rslang">RSLang</span> Statistics<h1>
  `;
  if (!getAuth()) {
    const title = document.createElement('h3');
    title.innerHTML = 'Please, Login or Register to start using statistics.';
    page.append(title);
    return page;
  }
  const windowsStatistics = await getWindowsStatistics();
  page.append(windowsStatistics);
  return page;
}

async function getWindowsStatistics() {
  const respStatistics = await getUserStatistic();
  const statisticsForTodayWords = getTodayStat<WordsStatistic>(respStatistics, 'words');
  const statisticsForTodaySprint = getTodayStat<GameStatistic>(respStatistics, 'sprint');
  const statisticsForTodayAudioCall = getTodayStat<GameStatistic>(respStatistics, 'audiocall');

  const wordsLearned = statisticsForTodayWords.learnedWordsQty;
  const wordsNew = statisticsForTodayWords.newWordsQty;
  const wordsRightAnswers = statisticsForTodayWords.rightAnswers;

  const audiocallRightAnswers = statisticsForTodayAudioCall.rightAnswers;
  const audiocallLongestRow = statisticsForTodayAudioCall.longestRow;
  const audiocallNewWords = statisticsForTodayAudioCall.newWordsQty;

  const sprintRightAnswers = statisticsForTodaySprint.rightAnswers;
  const sprintLongestRow = statisticsForTodaySprint.longestRow;
  const sprintNewWords = statisticsForTodaySprint.newWordsQty;

  const windowsStatistics = document.createElement('div');
  windowsStatistics.innerHTML = `
    <section class="statistics-section statistics-section-for-day">
      <h2 class="display-2">Statistics for the day</h2>
      <div class="row">
        <div class="col">
          <div class="statistic-info-wrapper">
            <p class="statistic-info-of-day display-3">${wordsLearned}</p>
            <h5 class="card-title display-5">
              Words learned
            </h5>
          </div>
        </div>
        <div class="col">
          <div class="statistic-info-wrapper">
            <p class="statistic-info-of-day display-3">${wordsNew}</p>
            <h5 class="card-title display-5">
              New words
            </h5>
          </div>
        </div>
        <div class="col">
          <div class="statistic-info-wrapper">
            <p class="statistic-info-of-day display-3">${wordsRightAnswers}</p>
            <h5 class="card-title display-5">
              Right answers
            </h5>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col d-flex justify-content-center">
          <div class="card" style="width: 19rem;">
            <div class="card-body">
              <h5 class="card-title card-title-statistics display-6">
                Sprint
              </h5>
              <p class="card-text card-text-statistics">Learned <span class="game-statistic-info">${audiocallRightAnswers}</span> words.</p>
              <p class="card-text card-text-statistics">Correct answers <span class="game-statistic-info">${audiocallNewWords}</span>.</p>
              <p class="card-text card-text-statistics">Longest series of correct answers <span class="game-statistic-info">${audiocallLongestRow}</span>.</p>
            </div>
          </div>
        </div>
        <div class="col d-flex justify-content-center">
          <div class="card" style="width: 19rem;">
            <div class="card-body">
              <h5 class="card-title card-title-statistics display-6">
                Audio-call
              </h5>
              <p class="card-text card-text-statistics">Learned <span class="game-statistic-info">${sprintRightAnswers}</span> words.</p>
              <p class="card-text card-text-statistics">Correct answers <span class="game-statistic-info">${sprintLongestRow}</span>.</p>
              <p class="card-text card-text-statistics">Longest series of correct answers <span class="game-statistic-info">${sprintNewWords}</span>.</p>
            </div>
          </div>
        </div>
      </div>
    <section>
    <section class="statistics-section statistics-section-for-all-time">
      <h2 class="display-2">Statistics for all time</h2>
    <section>
  `;
  return windowsStatistics;
}
