import './footer.css';

export default function getFooter(): HTMLElement {
  const elem = document.createElement('footer');
  elem.className = 'footer';

  elem.innerHTML = `
    <div class='container>
      <div class="footer-container">
        <ul class="footer__team">
          <li><a href="https://github.com/Jeneko" class="git" target="_blank">Jeneko</a></li>
          <li><a href="https://github.com/ArtemDubovov" class="git" target="_blank">ArtemDubovov</a></li>
          <li><a href="https://github.com/dmitrykaliasinski" class="git" target="_blank">dmitrykaliasinski</a></li>
        </ul>
        <p>2022</p>
        <a href="https://rs.school/js/" class="footer-rsschool" target="_blank"></a>
      </div>
    </div>
  `;

  return elem;
}
