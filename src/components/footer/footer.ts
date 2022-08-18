import './footer.css';

export default function getFooter(): HTMLElement {
  const elem = document.createElement('footer');
  elem.className = 'footer';

  elem.innerHTML = `
    <h3>Footer</h3>
  `;

  return elem;
}
