import './about-team.css';

export default function getAboutTeam(): HTMLElement {
  const elem = document.createElement('div');
  elem.className = 'about-team';

  elem.innerHTML = `
    <div class="container">
      <h1>Our Team</h1>
    </div>
  `;

  return elem;
}
