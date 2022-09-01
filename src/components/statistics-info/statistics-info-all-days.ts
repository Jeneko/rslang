export default async function getStatisticInfoAllDays() {
  const elem = document.createElement('div');
  elem.innerHTML = `
    <section class="statistics-section statistics-section-for-all-time">
      <h2 class="display-2">Statistic for all time</h2>
    </section>
  `;
  elem.classList.add('container', 'statistics-window');
  return elem;
}
