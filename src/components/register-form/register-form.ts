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
      <label for="register-form-email" class="form-label">Email address</label>
      <input type="email" class="form-control" id="register-form-email" aria-describedby="emailHelp">
      <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
    </div>
    <div class="mb-3">
      <label for="register-form-password" class="form-label">Password</label>
      <input type="password" class="form-control" id="register-form-password" aria-describedby="passHelp">
      <div id="passHelp" class="form-text">Password must be 8 symbols long minimum.</div>
    </div>
    <button type="submit" class="btn btn-primary">Register / Login</button>
  `;

  eventHandler(elem);

  return elem;
}
