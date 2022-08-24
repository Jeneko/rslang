export default function getAboutTeam(): HTMLElement {
  const elem = document.createElement('div');
  elem.className = 'about-team';

  elem.innerHTML = `
    <br><br>
    <button class="btn btn-primary">Let's start</button>
  `;

  return elem;
}
