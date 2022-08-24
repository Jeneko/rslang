import './footer.css';

export default function getFooter(): HTMLElement {
  const elem = document.createElement('footer');
  elem.className = 'footer';

  elem.innerHTML = `
    <div class="container">
      <div class="footer-container">
        <div class="footer__team">
          <a href="https://github.com/Jeneko" class="link-light" target="_blank">Jeneko</a>
          <a href="https://github.com/ArtemDubovov" class="link-light" target="_blank">ArtemDubovov</a>
          <a href="https://github.com/dmitrykaliasinski" class="link-light" target="_blank">dmitrykaliasinski</a>
        </div>
        <div class="footer-year">2022</div>
        <a href="https://rs.school/js/" class="footer-rsschool" target="_blank"></a>
      </div>
    </div>
  `;

  return elem;
}
