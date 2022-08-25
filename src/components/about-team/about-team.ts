import './about-team.css';

export default function getAboutTeam(): HTMLElement {
  const elem = document.createElement('div');
  elem.className = 'about-team';

  elem.innerHTML = `
    <div class="container ">
      <h1 class="page-heading">
        <span class="page-heading__rslang">RSLang</span> Our Team
      </h1>
      <div class="team">
        <div class="team__card">
          <div class="team__card-img img-jeneko"></div>
          <div class="team__card-about">
            <h2 class="team__card-about-name">Evgeniy Kozlov</h2>
            <p class="team__card-about-specialty">Team leader, Frontend developer</p>
            <p class="team__card-about-progress">Did basic project settings, login logout forms,TextBook page, saving and getting statistic logic</p>
            <a href="https://github.com/Jeneko" target="_blank" class="team__card-about-git"></a>
          </div>
        </div>
        <div class="team__card team__card-second">
          <div class="team__card-img img-dima"></div>
          <div class="team__card-about">
            <h2 class="team__card-about-name">Dmitry Kaliasinski</h2>
            <p class="team__card-about-specialty">Frontend developer</p>
            <p class="team__card-about-progress">Implemented Sprint game and team page</p>
            <a href="https://github.com/dmitrykaliasinski" target="_blank" class="team__card-about-git"></a>
          </div>
        </div>
        <div class="team__card">
          <div class="team__card-img img-artem"></div>
          <div class="team__card-about">
            <h2 class="team__card-about-name">Artem Dubovov</h2>
            <p class="team__card-about-specialty">Frontend developer</p>
            <p class="team__card-about-progress">Implemented AudioCall game and main page</p>
            <a href="https://github.com/ArtemDubovov" target="_blank" class="team__card-about-git"></a>
          </div>
        </div>
      </div>
    </div>
  `;

  return elem;
}
