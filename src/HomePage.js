import router from './router.js';
import { store } from './storeInstance.js';

export class HomePage {
  #container;
  #inner;
  #statusEl;
  #homeBtn;
  #loginBtn;
  #themeBtn;

  render(parentElement) {
    this.#container = document.createElement('div');
    this.#container.className = 'home-page';

    const content = document.createElement('div');
    content.className = 'home-content';

    const title = document.createElement('h1');
    title.textContent = 'Routing';
    content.appendChild(title);

    const buttons = document.createElement('div');
    buttons.className = 'home-buttons';

    this.#homeBtn = document.createElement('button');
    this.#homeBtn.type = 'button';
    this.#homeBtn.className = 'home-btn home-btn-home';
    this.#homeBtn.textContent = 'Главная';
    this.#homeBtn.addEventListener('click', () => router.navigateTo('/'));
    buttons.appendChild(this.#homeBtn);

    const aboutBtn = document.createElement('button');
    aboutBtn.type = 'button';
    aboutBtn.className = 'home-btn home-btn-about';
    aboutBtn.textContent = 'О проекте';
    aboutBtn.addEventListener('click', () => router.navigateTo('/about'));
    buttons.appendChild(aboutBtn);

    const articlesBtn = document.createElement('button');
    articlesBtn.type = 'button';
    articlesBtn.className = 'home-btn home-btn-articles';
    articlesBtn.textContent = 'Статьи';
    articlesBtn.addEventListener('click', () => router.navigateTo('/articles'));
    buttons.appendChild(articlesBtn);

    this.#loginBtn = document.createElement('button');
    this.#loginBtn.type = 'button';
    this.#loginBtn.className = 'home-btn home-btn-login';
    this.#loginBtn.addEventListener('click', () => {
      if (store.select('user')) {
        store.setState({ user: null });
      } else {
        router.navigateTo('/login');
      }
    });
    buttons.appendChild(this.#loginBtn);

    this.#themeBtn = document.createElement('button');
    this.#themeBtn.type = 'button';
    this.#themeBtn.className = 'home-btn home-btn-theme';
    this.#themeBtn.addEventListener('click', () => {
      const theme = store.select('theme');
      store.setState({ theme: theme === 'dark' ? 'light' : 'dark' });
    });
    buttons.appendChild(this.#themeBtn);

    content.appendChild(buttons);
    this.#container.appendChild(content);

    this.#inner = document.createElement('div');
    this.#inner.className = 'home-inner';
    this.#container.appendChild(this.#inner);

    parentElement.replaceChildren(this.#container);
    this.update();
    return this.#inner;
  }


  buildHomeCard() {
    const card = document.createElement('div');
    card.className = 'article-card';
    const p = document.createElement('p');
    p.textContent = 'Клиентский роутинг и мини‑SPA · глобальный стор';
    card.appendChild(p);

    this.#statusEl = document.createElement('p');
    this.#statusEl.className = 'home-status';
    const { user, theme, savedArticles } = store.getState();
    const userLabel = user ? `Вошли как ${user.email}` : 'Гость';

    this.#statusEl.textContent = `${userLabel} · Тема: ${theme} · Избранное: ${savedArticles.length}`;

    card.appendChild(this.#statusEl);
    return card;
  };

  update() {
    const { user, theme } = store.getState();
    const currentPath = window.location.hash.slice(1) || '/';
    const userLabel = user ? `Вошли как ${user.email}` : 'Гость';

    this.#homeBtn.style.display = currentPath === '/' ? 'none' : '';
    this.#loginBtn.textContent = user ? 'Выйти' : 'Логин';
    this.#loginBtn.className = 'home-btn ' + (user ? 'home-btn-logout' : 'home-btn-login');

    this.#themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}