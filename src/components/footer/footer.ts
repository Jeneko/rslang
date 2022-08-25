import './footer.css';

export default function getFooter(): HTMLElement {
  const elem = document.createElement('footer');
  elem.className = 'footer';

  elem.innerHTML = `
    <div class="container text-center">
      <div class="row align-items-center">
        <div class="col">
          <a href="https://github.com/Jeneko" class="link-light" target="_blank">Jeneko</a>
          <a href="https://github.com/ArtemDubovov" class="link-light" target="_blank">ArtemDubovov</a>
          <a href="https://github.com/dmitrykaliasinski" class="link-light" target="_blank">dmitrykaliasinski</a>
        </div>
        <div class="col">2022</div>
        <div class="col">
          <a href="https://rs.school/js/" class="footer-rsschool" target="_blank"></a>
        </div>
      </div>
    </div>
  `;

  return elem;
}
