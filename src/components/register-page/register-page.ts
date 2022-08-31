import getFooter from 'components/footer/footer';
import getRegisterForm from 'components/register-form/register-form';

export default function getRegisterPage(): HTMLElement {
  const elem = document.createElement('div');
  elem.className = 'register-page';

  elem.innerHTML = `
    <div class="container">
      <h1 class="page-heading">
        <span class="page-heading__rslang">RSLang</span> Register
      </h1>
    </div>
  `;

  const container = elem.querySelector('.container') as HTMLElement;

  container.append(getRegisterForm());
  elem.append(getFooter());

  return elem;
}
