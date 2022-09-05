import * as auth from 'utils/auth';
import './auth-menu.css';

function handleEvents(elem: HTMLElement): void {
  elem.onclick = (e) => {
    const target = e.target as HTMLElement;

    // Click on Logout
    if (target.closest('.btn-logout')) {
      auth.deleteAuth();
      elem.dispatchEvent(new Event('authUpdate', { bubbles: true }));
    }
  };
}

export default function getAuthMenu(): HTMLElement {
  const curAuth = auth.getAuth();
  const elem = document.createElement('div');
  elem.className = 'auth-menu';

  if (curAuth) {
    elem.innerHTML = `
      <div class="btn-group">
        <a href="#account" class="btn btn-warning btn-logout">${curAuth.name} | logout</a>
      </div>
    `;
  } else {
    elem.innerHTML = `
    <div class="btn-group">
      <a href="#register" class="btn btn-warning load-page-link">Register</a>
      <a href="#login" class="btn btn-primary load-page-link">Login</a>
    </div>
  `;
  }

  handleEvents(elem);

  return elem;
}
