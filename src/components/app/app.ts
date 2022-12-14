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
import getStatisticPage from 'components/statistics-page/statistics-page';

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

  const getPage: Record<PageName, () => Promise<Element>> = {
    [PageName.main]: () => Promise.resolve(getMainPage()),
    [PageName.studyBook]: () => getStudyBookPage(),
    [PageName.audioCall]: () => getAudioCallPage(),
    [PageName.sprint]: () => getSprintPage(),
    [PageName.stats]: () => Promise.resolve(getMainPage()),
    [PageName.team]: () => Promise.resolve(getTeamPage()),
    [PageName.register]: () => Promise.resolve(getRegisterPage()),
    [PageName.login]: () => Promise.resolve(getLoginPage()),
    [PageName.statistics]: () => Promise.resolve(getStatisticPage()),
  };

  const fragment = new DocumentFragment();

  fragment.append(getHeader());
  fragment.append(await getPage[curPage]());

  document.body.innerHTML = '';
  document.body.append(fragment);
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
