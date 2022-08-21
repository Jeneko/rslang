import getFooter from 'components/footer/footer';
import getLoginForm from 'components/login-form/login-form';

export default function getRegisterPage(): HTMLElement {
  const elem = document.createElement('div');
  elem.className = 'login-page';

  elem.innerHTML = `
    <div class="container">
      <h1 class="page-heading">
        <span class="page-heading__rslang">RSLang</span> Login
      </h1>
    </div>
  `;

  const container = elem.querySelector('.container') as HTMLElement;

  container.append(getLoginForm());
  elem.append(getFooter());

  return elem;
}
