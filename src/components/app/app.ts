import * as state from 'utils/state';
import { PageName } from 'types/index';
import getHeader from 'components/header/header';
import getMainPage from 'components/main-page/main-page';
import getLoginPage from 'components/login-page/login-page';
import getSprintPage from 'components/sprint-page/sprint-page';
import getRegisterPage from 'components/register-page/register-page';
import getStudyBookPage from 'components/study-book-page/study-book-page';
import getAudioCallPage from 'components/audio-call-page/audio-call-page';
import getTeamPage from 'components/team-page/team-page';

function handleLinks(e: Event): void {
  const target = e.target as HTMLElement;
  const loadPageLink = target.closest('.load-page-link');

  if (loadPageLink) {
    e.preventDefault();
    const href = loadPageLink.getAttribute('href') as string;
    state.updateState('page', href.slice(1));
    loadPage();
  }
}

async function loadPage(): Promise<void> {
  const curPage = state.getState().page;
  document.body.innerHTML = '';

  document.body.append(getHeader());

  // TODO: replace with a mapper
  switch (curPage) {
    case PageName.main:
      document.body.append(getMainPage());
      break;
    case PageName.studyBook:
      document.body.append(await getStudyBookPage());
      break;
    case PageName.audioCall:
      document.body.append(await getAudioCallPage());
      break;
    case PageName.sprint:
      document.body.append(await getSprintPage());
      break;
    case PageName.register:
      document.body.append(getRegisterPage());
      break;
    case PageName.login:
      document.body.append(getLoginPage());
      break;
    case PageName.team:
      document.body.append(getTeamPage());
      break;
    default:
      break;
  }
}

function handleEvents(): void {
  // Load page
  document.addEventListener('loadPage', loadPage);
  // Auth update
  document.addEventListener('authUpdate', loadPage);
  // Click on links
  document.addEventListener('click', handleLinks);
}

export default function startApp(): void {
  loadPage();
  handleEvents();
}
