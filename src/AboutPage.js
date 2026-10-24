import { store } from './storeInstance.js';

export class AboutPage {
  #container;

  render(parentElement) {
    const { user, theme, savedArticles, articlesFilter } = store.getState();

    this.#container = document.createElement('div');
    this.#container.className = 'about-page';

    const content = document.createElement('div');
    content.className = 'about-content';

    const topNav = document.createElement('div');
    topNav.className = 'about-top-nav';

    const title = document.createElement('h1');
    title.textContent = 'О приложении';
    topNav.appendChild(title);

    content.appendChild(topNav);

    const projectSection = document.createElement('div');
    projectSection.className = 'about-section';

    const projectTitle = document.createElement('h2');
    projectTitle.textContent = 'О проекте';
    projectSection.appendChild(projectTitle);

    const versionText = document.createElement('p');
    versionText.textContent = 'Версия: 1.0.0';
    projectSection.appendChild(versionText);

    const descriptionText = document.createElement('p');
    descriptionText.textContent = 'Разработано в рамках домашнего задания: клиентский роутинг + глобальный стор + localStorage.';
    projectSection.appendChild(descriptionText);

    content.appendChild(projectSection);

    const stateSection = document.createElement('div');
    stateSection.className = 'about-section';

    const stateTitle = document.createElement('h2');
    stateTitle.textContent = 'Текущее состояние (store)';
    stateSection.appendChild(stateTitle);

    const list = document.createElement('ul');
    list.className = 'about-state-list';

    [
      ['Пользователь', user ? user.email : 'гость'],
      ['Тема', theme],
      ['Избранных статей', String(savedArticles.length)],
      ['Фильтр статей', articlesFilter],
    ].forEach(([label, value]) => {
      const li = document.createElement('li');
      li.textContent = `${label}: ${value}`;
      list.appendChild(li);
    });

    stateSection.appendChild(list);

    const note = document.createElement('p');
    note.className = 'about-note';
    note.textContent = 'Сохраняются в localStorage: пользователь, тема, избранное.';
    stateSection.appendChild(note);

    content.appendChild(stateSection);

    this.#container.appendChild(content);
    parentElement.replaceChildren(this.#container);
    return this.#container;
  }
}