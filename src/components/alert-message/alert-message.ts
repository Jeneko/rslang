import { AlertType } from 'types/index';

export default function getAlertMessage(type: AlertType, message: string): HTMLElement {
  const elem = document.createElement('div');
  elem.className = `alert alert-dismissible alert-${type}`;
  elem.innerHTML = `
    <div>${message}</div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  return elem;
}
