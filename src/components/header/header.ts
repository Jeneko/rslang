import * as state from 'utils/state';
import getAuthMenu from 'components/auth-menu/auth-menu';
import './header.css';

function highlightActiveMenuItem(elem: HTMLElement): void {
  const { page } = state.getState();
  const activePageLink = elem.querySelector(`[href="#${page}"]`);
  const activeDropdown = activePageLink?.closest('.dropdown');

  activePageLink?.classList.add('active-page');
  activeDropdown?.classList.add('active');
}

export default function getHeader(): HTMLElement {
  const elem = document.createElement('header');
  elem.className = 'header';

  elem.innerHTML = `
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link load-page-link" href="#main">Main</a>
            </li>
            <li class="nav-item">
              <a class="nav-link load-page-link" href="#study-book">Study Book</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Mini-Games
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item load-page-link" href="#audio-call">Audio call</a></li>
                <li><a class="dropdown-item load-page-link" href="#sprint">Sprint</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link load-page-link" href="#statistics">Statistics</a>
            </li>
            <li class="nav-item">
              <a class="nav-link load-page-link" href="#team">Our Team</a>
            </li>
          </ul>
          <div class="auth-menu"></div>
        </div>
      </div>
    </nav>
  `;

  const authMenu = elem.querySelector('.auth-menu') as HTMLElement;
  authMenu.replaceWith(getAuthMenu());

  highlightActiveMenuItem(elem);

  return elem;
}
