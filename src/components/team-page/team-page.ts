import getAboutTeam from 'components/about-team/about-team';
import getFooter from 'components/footer/footer';

export default function getTeamPage(): HTMLElement {
  const elem = document.createElement('div');
  elem.className = 'team-page';

  elem.append(getAboutTeam());
  elem.append(getFooter());

  return elem;
}
