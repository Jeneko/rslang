import { getTodayStat } from 'utils/statistic';
import { getUserStatistic } from 'API/index';
import { WordsStatistic, GameStatistic, StatusCardStatistics } from 'types/index';

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

  const statisticsForTodayWords = getTodayStat<WordsStatistic>(respStatistics, 'words');
  const statisticsForTodaySprint = getTodayStat<GameStatistic>(respStatistics, 'sprint');
  const statisticsForTodayAudioCall = getTodayStat<GameStatistic>(respStatistics, 'audiocall');

  const allStatAudiocall = respStatistics.optional.audiocall.stat;
  const allStatSprint = respStatistics.optional.sprint.stat;
  const allStatWords = respStatistics.optional.words.stat;

  const lengthAudiocall = allStatAudiocall.length;
  const lengthSprint = allStatSprint.length;
  const lengthWords = allStatWords.length;

  const wordsLearned = statisticsForTodayWords.learnedWordsQty;
  const wordsNew = statisticsForTodayWords.newWordsQty;
  const wordsRightAnswers = statisticsForTodayWords.rightAnswers;

  const audiocallRightAnswers = statisticsForTodayAudioCall.rightAnswers;
  const audiocallLongestRow = statisticsForTodayAudioCall.longestRow;
  const audiocallNewWords = statisticsForTodayAudioCall.newWordsQty;
  const audiocallWrongAnswers = statisticsForTodayAudioCall.wrongAnswers;
  console.log(audiocallRightAnswers, audiocallWrongAnswers);
  const audiocallPercentRightAnswers = getPercentAgeOfCorrectAnswers(audiocallRightAnswers, audiocallWrongAnswers);

  const sprintRightAnswers = statisticsForTodaySprint.rightAnswers;
  const sprintLongestRow = statisticsForTodaySprint.longestRow;
  const sprintNewWords = statisticsForTodaySprint.newWordsQty;
  const sprintWrongAnswers = statisticsForTodaySprint.wrongAnswers;
  const sprintPercentRightAnswers = getPercentAgeOfCorrectAnswers(sprintRightAnswers, sprintWrongAnswers);

  const windowsStatistics = document.createElement('div');
  windowsStatistics.classList.add('statistics-block');
  windowsStatistics.innerHTML = `
    <section class="statistics-section statistics-section-for-day">
      <h2 class="display-2">Statistics for words</h2>
        <div class="statistic-info-wrapper">
        <p class="statistic-info-of-day display-3">${respStatistics.learnedWords}</p>
        <h5 class="card-title display-5">
          Words learned
        </h5>
      </div>
      <h2 class="display-2">Statistics for the day</h2>
      <div class="row align-items-end justify-content-center">
        <div class="card-block col-xxl-4 col-xl-4 col-lg-12 col-md-12 col-sm-12">
            <div class="card" style="width: 20rem;">
              <div class="card-body d-flex justify-content-between flex-column card-body-words">
                <h5 class="card-title card-title-statistics display-6">
                  Words statistics
                </h5>
                <div class="card-text-wrapper">
                  <p class="card-text card-text-statistics">Learned <span class="game-statistic-info-learned">${wordsLearned}</span> words.</p>
                  <p class="card-text card-text-statistics">New <span class="game-statistic-info-new-words">${wordsNew}</span> words.</p>
                  <p class="card-text card-text-statistics">Amount correct answers <span class="game-statistic-info-right-answers">${wordsRightAnswers}</span>.</p>
                </div>
                <div class="statistics-card-pagination d-flex justify-content-center align-items-center">
                  <button type="button" class="btn btn-primary btn-sm button-left"><</button>
                    <span data-dateindex="${lengthWords - 1}" class="card-statistics-date">${convertDate(allStatWords[lengthWords - 1].date)}</span>
                  <button disabled type="button" class="btn btn-primary btn-sm button-right">></button>
                </div>
              </div>
            </div>
          </div>
        <div class="card-block col-xxl-4 col-xl-4 col-lg-12 col-md-12 col-sm-12">
          <div class="card" style="width: 20rem;">
            <div class="card-body d-flex justify-content-between flex-column card-body-audiocall">
              <h5 class="card-title card-title-statistics display-6">
                Audio-call
              </h5>
              <div class="card-text-wrapper">
                <p class="card-text card-text-statistics">Percent correctly answers <span class="game-statistic-info-right-answers">${audiocallPercentRightAnswers}</span> %.</p>
                <p class="card-text card-text-statistics">New <span class="game-statistic-info-new-words">${audiocallNewWords}</span> words.</p>
                <p class="card-text card-text-statistics">Longest series of correct answers <span class="game-statistic-info-longest-row">${audiocallLongestRow}</span>.</p>
              </div>
              <div class="statistics-card-pagination d-flex justify-content-center align-items-center">
                <button type="button" class="btn btn-primary btn-sm button-left"><</button>
                  <span data-dateindex="${lengthAudiocall - 1}" class="card-statistics-date card-statistics-audiocall-date">${convertDate(allStatAudiocall[lengthAudiocall - 1].date)}</span>
                <button disabled type="button" class="btn btn-primary btn-sm button-right">></button>
              </div>
            </div>
          </div>
        </div>
        <div class="card-block col-xxl-4 col-xl-4 col-lg-12 col-md-12 col-sm-12">
          <div class="card" style="width: 20rem;">
            <div class="card-body d-flex justify-content-between flex-column card-body-sprint">
              <h5 class="card-title card-title-statistics display-6">
                Sprint
              </h5>
              <div class="card-text-wrapper">
                <p class="card-text card-text-statistics">Percent correctly answers <span class="game-statistic-info-right-answers">${sprintPercentRightAnswers}</span>.</p>
                <p class="card-text card-text-statistics">New <span class="game-statistic-info-new-words">${sprintLongestRow}</span> words.</p>
                <p class="card-text card-text-statistics">Longest series of correct answers <span class="game-statistic-info-longest-row">${sprintNewWords}</span>.</p>
              </div>
                <div class="statistics-card-pagination d-flex justify-content-center align-items-center">
                <button type="button" class="btn btn-primary btn-sm button-left"><</button>
                  <span data-dateindex="${lengthSprint - 1}" class="card-statistics-date card-statistics-sprint-date">${convertDate(allStatSprint[lengthSprint - 1].date)}</span>
                <button disabled type="button" class="btn btn-primary btn-sm button-right">></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    <section>
  `;

  const cardWords = windowsStatistics.querySelector('.card-body-words') as HTMLElement;
  const cardAudioCall = windowsStatistics.querySelector('.card-body-audiocall') as HTMLElement;
  const cardSprint = windowsStatistics.querySelector('.card-body-sprint') as HTMLElement;

  handleEventPaginationButtons(allStatWords as WordsStatistic[], cardWords, StatusCardStatistics.Word);
  handleEventPaginationButtons(allStatAudiocall as GameStatistic[], cardAudioCall, StatusCardStatistics.Game);
  handleEventPaginationButtons(allStatSprint as GameStatistic[], cardSprint, StatusCardStatistics.Game);
  return windowsStatistics;
}

function convertDate(ms: number): string {
  const date = new Date(ms);
  return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
}

function handleEventPaginationButtons(allStatObject: WordsStatistic[] | GameStatistic[], cardBody: HTMLElement, key: StatusCardStatistics.Word | StatusCardStatistics.Game): void {
  const buttonLeft = cardBody.querySelector('.button-left') as HTMLElement;
  const buttonRight = cardBody.querySelector('.button-right') as HTMLElement;
  const dataTable = (cardBody.querySelector('.card-statistics-date') as HTMLElement);

  const learnWords = cardBody.querySelector('.game-statistic-info-learned') as HTMLElement || cardBody.querySelector('.game-statistic-info-longest-row') as HTMLElement;
  const newWords = cardBody.querySelector('.game-statistic-info-new-words') as HTMLElement;
  const rightAnswers = cardBody.querySelector('.game-statistic-info-right-answers') as HTMLElement;

  if (allStatObject.length <= 1) {
    buttonLeft.setAttribute('disabled', 'true');
  }

  buttonLeft.addEventListener('click', () => {
    const currentDateIndex = dataTable.dataset.dateindex as string;

    const newIndex = +(currentDateIndex) - 1;

    let currentLearn;
    const currentNewWords = (allStatObject[newIndex].newWordsQty).toString();
    const currentRightAnswers = (allStatObject[newIndex].rightAnswers).toString();

    if (key === StatusCardStatistics.Game) {
      currentLearn = ((allStatObject[newIndex] as GameStatistic).longestRow).toString();

      learnWords.textContent = currentLearn;
      newWords.textContent = currentNewWords;
      rightAnswers.textContent = currentRightAnswers;
    } else if (key === StatusCardStatistics.Word) {
      currentLearn = ((allStatObject[newIndex] as WordsStatistic).learnedWordsQty).toString();
      learnWords.textContent = currentLearn;
      newWords.textContent = currentNewWords;
      rightAnswers.textContent = currentRightAnswers;
    }

    dataTable.dataset.dateindex = newIndex.toString();
    dataTable.innerHTML = `${convertDate(allStatObject[newIndex].date)}`;

    if (+newIndex !== allStatObject.length - 1) {
      buttonRight.removeAttribute('disabled');
    }
    if (+newIndex < 1) {
      buttonLeft.setAttribute('disabled', 'true');
    }
  });

  buttonRight.addEventListener('click', () => {
    const lengthDate = allStatObject.length;
    const currentDateIndex = dataTable.dataset.dateindex as string;
    const newIndex = +(currentDateIndex) + 1;

    const currentNewWords = (allStatObject[newIndex].newWordsQty).toString();
    const currentRightAnswers = (allStatObject[newIndex].rightAnswers).toString();
    let currentLearn;

    if (key === StatusCardStatistics.Game) {
      currentLearn = ((allStatObject[newIndex] as GameStatistic).longestRow).toString();
      learnWords.textContent = currentLearn;
      newWords.textContent = currentNewWords;
      rightAnswers.textContent = currentRightAnswers;
    } else if (key === StatusCardStatistics.Word) {
      currentLearn = ((allStatObject[newIndex] as WordsStatistic).learnedWordsQty).toString();
      learnWords.textContent = currentLearn;
      newWords.textContent = currentNewWords;
      rightAnswers.textContent = currentRightAnswers;
    }

    dataTable.dataset.dateindex = newIndex.toString();
    dataTable.innerHTML = `${convertDate(allStatObject[newIndex].date)}`;

    if (+newIndex === lengthDate - 1) {
      buttonRight.setAttribute('disabled', 'true');
    }
    if (+newIndex > 0) {
      buttonLeft.removeAttribute('disabled');
    }
  });
}

function getPercentAgeOfCorrectAnswers(correct: string | number, wrong: string | number): number {
  const sum = +correct + +wrong;
  return Math.trunc((+correct / sum) * +wrong);
}
