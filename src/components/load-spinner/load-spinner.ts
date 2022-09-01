import './load-spinner.css';

export function showLoadSpinner(show: boolean) {
  if (show) {
    document.body.append(getSpinner());
    return;
  }
  document.body.querySelector('.load-spinner')?.remove();
}

export function getSpinner() {
  const elem = document.createElement('div');
  elem.innerHTML = `
    <div class="load-spinner__content">
      <span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
      <div class="load-spinner__text">Loading...</div>
    </div>
  `;
  elem.classList.add('load-spinner');
  return elem;
}
