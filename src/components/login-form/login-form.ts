import * as auth from 'utils/auth';
import { loginUser } from 'API/index';
import { AlertType } from 'types/index';
import { outputAlert, outputResponseErrors, clearAlerts } from 'components/alert-message/alert-message';

function eventHandler(elem: HTMLElement): void {
  interface FormElements extends HTMLFormControlsCollection {
    email: HTMLInputElement;
    password: HTMLInputElement;
  }

  elem.onsubmit = async (e): Promise<void> => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const { email, password } = target.elements as FormElements;
    const submitBtn = target.querySelector('button[type="submit"]') as HTMLButtonElement;

    clearAlerts(elem);

    // TODO: show spinner while logging in
    submitBtn.disabled = true;
    const loginResult = await loginUser(email.value, password.value);
    submitBtn.disabled = false;

    if ('errors' in loginResult) {
      outputResponseErrors(elem, loginResult);
      return;
    }

    auth.saveAuth(loginResult);
    elem.dispatchEvent(new Event('authUpdate', { bubbles: true }));
  };
}

export default function getRegisterForm(): HTMLElement {
  const curAuth = auth.getAuth();
  const elem = document.createElement('form');
  elem.className = 'user-form register-form';

  if (curAuth) {
    elem.innerHTML = `
      <h3>Welcome, ${curAuth.name}!</h3>
      <p>Thank you for comming. Please, enjoy all functions of RSLang application.</p>
    `;
    outputAlert(elem, AlertType.success, 'Success!');
  } else {
    elem.innerHTML = `
      <div class="mb-3">
        <label for="login-form-email" class="form-label">
          Email address
          <span class="asterisk" title="Required field">*<span>
        </label>
        <input name="email" type="email" class="form-control" id="login-form-email" aria-describedby="emailHelp" required>
        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
      </div>
      <div class="mb-3">
        <label for="login-form-password" class="form-label">
          Password
          <span class="asterisk" title="Required field">*<span>
        </label>
        <input name="password" type="password" pattern=".{8,}" class="form-control" id="login-form-password" aria-describedby="passHelp" title="8 characters minimum" required>
        <div id="passHelp" class="form-text">Password must be 8 characters minimum.</div>
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    `;
  }

  eventHandler(elem);

  return elem;
}
