import * as auth from 'utils/auth';
import {
  createUser, loginUser, updateUserStatistic, createNewUserStatistic,
} from 'API/index';
import { AlertType } from 'types/index';
import { outputAlert, outputResponseErrors, clearAlerts } from 'components/alert-message/alert-message';

function eventHandler(elem: HTMLElement): void {
  interface FormElements extends HTMLFormControlsCollection {
    name: HTMLInputElement;
    email: HTMLInputElement;
    password: HTMLInputElement;
  }

  elem.onsubmit = async (e): Promise<void> => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const { name, email, password } = target.elements as FormElements;
    const submitBtn = target.querySelector('button[type="submit"]') as HTMLButtonElement;

    clearAlerts(elem);

    submitBtn.disabled = true;
    const creationResult = await createUser(name.value, email.value, password.value);
    submitBtn.disabled = false;

    if ('errors' in creationResult) {
      outputResponseErrors(elem, creationResult);
      return;
    }

    const loginResult = await loginUser(email.value, password.value);

    if ('errors' in loginResult) {
      outputResponseErrors(elem, loginResult);
      return;
    }

    auth.saveAuth(loginResult);
    updateUserStatistic(createNewUserStatistic());
    elem.dispatchEvent(new Event('authUpdate', { bubbles: true }));
  };
}

export default function getRegisterForm(): HTMLElement {
  const curAuth = auth.getAuth();
  const elem = document.createElement('form');
  elem.className = 'user-form register-form';

  if (curAuth) {
    elem.innerHTML = `
      <h3>Registration complete!</h3>
      <p>Thank you for your registration. Now you are able to use all functions of RSLang application.</p>
    `;
    outputAlert(elem, AlertType.success, 'Success!');
  } else {
    elem.innerHTML = `
      <div class="mb-3">
        <label for="register-form-name" class="form-label">
          User name
          <span class="asterisk" title="Required field">*<span>
        </label>
        <input name="name" type="text" class="form-control" id="register-form-name" required>
      </div>
      <div class="mb-3">
        <label for="register-form-email" class="form-label">
          Email address
          <span class="asterisk" title="Required field">*<span>
        </label>
        <input name="email" type="email" class="form-control" id="register-form-email" aria-describedby="emailHelp" required>
        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
      </div>
      <div class="mb-3">
        <label for="register-form-password" class="form-label">
          Password
          <span class="asterisk" title="Required field">*<span>
        </label>
        <input name="password" type="password" pattern=".{8,}" class="form-control" id="register-form-password" aria-describedby="passHelp" title="8 characters minimum" required>
        <div id="passHelp" class="form-text">Password must be 8 characters minimum.</div>
      </div>
      <button type="submit" class="btn btn-primary">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Register
      </button>
    `;
  }

  eventHandler(elem);

  return elem;
}
