import router from './router.js';
import { store } from './storeInstance.js';

export class LoginPage {
  #container;
  #form;
  #emailInput;
  #passwordInput;

  render(parentElement) {
    const currentUser = store.getState().user;

    this.#container = document.createElement('div');
    this.#container.className = 'login-page';

    const content = document.createElement('div');
    content.className = 'login-content';

    const topNav = document.createElement('div');
    topNav.className = 'login-top-nav';

    const title = document.createElement('h1');
    title.textContent = 'Вход в систему';
    topNav.appendChild(title);

    content.appendChild(topNav);

    this.#form = document.createElement('form');
    this.#form.className = 'login-form';
    this.#form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = this.#emailInput.value.trim();
      const password = this.#passwordInput.value;

      if (!email || !password) {
        alert('Заполните все поля');
        return;
      }

      store.setState({ user: { email } });
      router.navigateTo('/');
    });

    const emailLabel = document.createElement('label');
    emailLabel.textContent = 'Email';
    emailLabel.htmlFor = 'email';
    this.#form.appendChild(emailLabel);

    this.#emailInput = document.createElement('input');
    this.#emailInput.type = 'email';
    this.#emailInput.id = 'email';
    this.#emailInput.name = 'email';
    this.#emailInput.placeholder = 'example@mail.com';
    this.#emailInput.required = true;
    if (currentUser) this.#emailInput.value = currentUser.email;
    this.#form.appendChild(this.#emailInput);

    const passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Пароль';
    passwordLabel.htmlFor = 'password';
    this.#form.appendChild(passwordLabel);

    this.#passwordInput = document.createElement('input');
    this.#passwordInput.type = 'password';
    this.#passwordInput.id = 'password';
    this.#passwordInput.name = 'password';
    this.#passwordInput.placeholder = '••••••••';
    this.#passwordInput.required = true;
    this.#form.appendChild(this.#passwordInput);

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'login-submit-btn';
    submitButton.textContent = 'Войти';
    this.#form.appendChild(submitButton);

    content.appendChild(this.#form);
    this.#container.appendChild(content);
    parentElement.replaceChildren(this.#container);
    return this.#container;
  }
}