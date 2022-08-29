export default async function getStatPage() {
  const page = document.createElement('div');
  page.classList.add('container');
  page.innerHTML = `
    <h1 class="page-heading"><span class="page-heading__rslang">RSLang</span> Statistics<h1>
  `;
  const windowsStatistics = await getWindowsStatistics();
  page.append(windowsStatistics);
  return page;
}

async function getWindowsStatistics() {
  const windowsStatistics = document.createElement('div');
  windowsStatistics.innerHTML = `
    <section class="statistics-window statistics-window-for-day">
      <h2 class="display-2">Statistics for the day</h2>
      <div class="row">
        <div class="col">
          <div class="statistic-info-wrapper">
            <p class="statistic-info-of-day display-3">0</p>
            <h5 class="card-title display-5">
              Words learned
            </h5>
          </div>
        </div>
        <div class="col">
          <div class="statistic-info-wrapper">
            <p class="statistic-info-of-day display-3">0 %</p>
            <h5 class="card-title display-5">
              Correct answers
            </h5>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col d-flex justify-content-center">
          <div class="card" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title card-title-statistics display-6">
                Sprint
              </h5>
              <p class="card-text card-text-statistics">Learned <span class="game-statistic-info">0</span> words.</p>
              <p class="card-text card-text-statistics">Correct answers <span class="game-statistic-info">0 %</span></p>
              <p class="card-text card-text-statistics">Longest series of correct answers <span class="game-statistic-info">0</span></p>
            </div>
          </div>
        </div>
        <div class="col d-flex justify-content-center">
          <div class="card" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title card-title-statistics display-6">
                Audio-call
              </h5>
              <p class="card-text card-text-statistics">Learned <span class="game-statistic-info">0</span> words</p>
              <p class="card-text card-text-statistics">Correct answers <span class="game-statistic-info">0</span></p>
              <p class="card-text card-text-statistics">Longest series of correct answers <span class="game-statistic-info">0</span></p>
            </div>
          </div>
        </div>
      </div>
    <section>
    <section class="statistics-window statistics-window-for-all-time statistics-window--hidden">
      <h2 class="display-2">Statistics for all time</h2>
    <section>
  `;
  return windowsStatistics;
}
