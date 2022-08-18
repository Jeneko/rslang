import * as state from 'utils/state';
import { PageName } from 'types/index';
import getHeader from 'components/header/header';
import getMainPage from 'components/main-page/main-page';
import getSprintPage from 'components/sprint-page/sprint-page';
import getAudioCallPage from 'components/audio-call-page/audio-call-page';

async function loadPage(): Promise<void> {
  const curPage = state.getState().page;
  document.body.innerHTML = '';

  document.body.append(getHeader());

  // TODO: replace with a mapper
  switch (curPage) {
    case PageName.main:
      document.body.append(getMainPage());
      break;
    case PageName.audioCall:
      document.body.append(await getAudioCallPage());
      break;
    case PageName.sprint:
      document.body.append(await getSprintPage());
      break;
    default:
      break;
  }
}

function handleEvents(): void {
  // Load page
  document.addEventListener('loadPage', loadPage);
}

export default function startApp(): void {
  loadPage();
  handleEvents();
}
