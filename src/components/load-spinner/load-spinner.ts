import './load-spinner.css';

export default function getSpinner() {
  const elem = document.createElement('div');
  elem.innerHTML = `
  <button class="btn btn-primary" type="button" disabled>
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Loading...
  </button>
  `;
  elem.classList.add('load-spinner');
  return elem;
}
