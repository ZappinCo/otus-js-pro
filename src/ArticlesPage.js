import router from './router.js';
import { store } from './storeInstance.js';

export class ArticlesPage {
  #container;

  render(parentElement) {
    const { savedArticles, articlesFilter } = store.getState();

    const articles = [
      { id: 1, title: 'Статья 1', summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed tellus consequat, maximus sem id, interdum erat.' },
      { id: 2, title: 'Статья 2', summary: 'Donec vehicula metus id dui fringilla aliquam. Praesent eu metus eros.' },
      { id: 3, title: 'Статья 3', summary: 'Suspendisse pharetra gravida nisl. Nunc tempor at turpis vel pretium.' },
    ];

    this.#container = document.createElement('div');
    this.#container.className = 'articles-page';

    const content = document.createElement('div');
    content.className = 'articles-content';

    const topNav = document.createElement('div');
    topNav.className = 'articles-top-nav';

    const title = document.createElement('h1');
    title.textContent = 'Статьи';
    topNav.appendChild(title);

    content.appendChild(topNav);

    const filter = document.createElement('div');
    filter.className = 'articles-filter';

    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn' + (articlesFilter === 'all' ? ' active' : '');
    allBtn.textContent = 'Все';
    allBtn.addEventListener('click', () => {
      store.setState({ articlesFilter: 'all' });
    });
    filter.appendChild(allBtn);

    const savedBtn = document.createElement('button');
    savedBtn.className = 'filter-btn' + (articlesFilter === 'saved' ? ' active' : '');
    savedBtn.textContent = `Избранное (${savedArticles.length})`;
    savedBtn.addEventListener('click', () => {
      store.setState({ articlesFilter: 'saved' });
    });
    filter.appendChild(savedBtn);

    content.appendChild(filter);

    const list = document.createElement('div');
    list.className = 'articles-list';

    const visible = articlesFilter === 'saved'
      ? articles.filter(a => savedArticles.includes(a.id))
      : articles;

    if (visible.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = 'Пока нет статей в избранном.';
      list.appendChild(empty);
    }

    visible.forEach(article => {
      const card = document.createElement('div');
      card.className = 'article-card';

      const articleTitle = document.createElement('h2');
      articleTitle.textContent = article.title;
      card.appendChild(articleTitle);

      const summary = document.createElement('p');
      summary.textContent = article.summary;
      card.appendChild(summary);

      const isSaved = savedArticles.includes(article.id);

      const saveBtn = document.createElement('button');
      saveBtn.className = 'article-read-btn' + (isSaved ? ' saved' : '');
      saveBtn.textContent = isSaved ? '★ В избранном' : '☆ В избранное';
      saveBtn.addEventListener('click', () => {
        const current = store.getState().savedArticles;
        const next = current.includes(article.id)
          ? current.filter(id => id !== article.id)
          : [...current, article.id];

        store.setState({ savedArticles: next });
      });
      card.appendChild(saveBtn);

      list.appendChild(card);
    });

    content.appendChild(list);
    this.#container.appendChild(content);
    parentElement.replaceChildren(this.#container);
    return this.#container;
  }
}