import { AlertType, ResponseError } from 'types/index';

export function getAlertMessage(type: AlertType, message: string): HTMLElement {
  const elem = document.createElement('div');
  elem.className = `alert alert-dismissible alert-${type}`;
  elem.innerHTML = `
    <div>${message}</div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  return elem;
}

export function outputAlert(elem: HTMLElement, type: AlertType, message: string): void {
  elem.prepend(getAlertMessage(type, message));
}

export function outputResponseErrors(elem: HTMLElement, result: ResponseError): void {
  result.errors.forEach((error) => {
    outputAlert(elem, AlertType.danger, `Error: ${error.message}`);
  });
}

export function clearAlerts(elem: HTMLElement): void {
  const alerts = elem.querySelectorAll('.alert');
  alerts.forEach((alert) => alert.remove());
}
