import './register-form.css';

function eventHandler(elem: HTMLElement): void {
  elem.onsubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form!');
  };
}

export default function getRegisterForm(): HTMLElement {
  const elem = document.createElement('form');
  elem.className = 'register-form';

  elem.innerHTML = `
    <div class="mb-3">
      <label for="register-form-name" class="form-label">
        User name
        <span class="register-form-asterisk" title="Required field">*<span>
      </label>
      <input name="name" type="text" class="form-control" id="register-form-name" required>
    </div>
    <div class="mb-3">
      <label for="register-form-email" class="form-label">
        Email address
        <span class="register-form-asterisk" title="Required field">*<span>
      </label>
      <input name="email" type="email" class="form-control" id="register-form-email" aria-describedby="emailHelp" required>
      <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
    </div>
    <div class="mb-3">
      <label for="register-form-password" class="form-label">
        Password
        <span class="register-form-asterisk" title="Required field">*<span>
      </label>
      <input name="password" type="password" pattern=".{8,}" class="form-control" id="register-form-password" aria-describedby="passHelp" title="8 characters minimum" required>
      <div id="passHelp" class="form-text">Password must be 8 characters minimum.</div>
    </div>
    <button type="submit" class="btn btn-primary">Register</button>
  `;

  eventHandler(elem);

  return elem;
}
