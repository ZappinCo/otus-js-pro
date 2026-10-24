import './style.css';

import { AboutPage } from './AboutPage.js';
import { ArticlesPage } from './ArticlesPage.js';
import { HomePage } from './HomePage.js';
import { LoginPage } from './LoginPage.js';
import router from './router.js';
import { store } from './storeInstance.js';

export async function runApp(element) {
  const home = new HomePage();
  const login = new LoginPage();
  const about = new AboutPage();
  const articles = new ArticlesPage();

  document.body.dataset.theme = store.getState().theme;

  const inner = home.render(element);

  router
    .addRoute('/', () => {
      inner.replaceChildren(home.buildHomeCard()); 
      home.update();
    })
    .addRoute('/login', () => {
      login.render(inner);
      home.update();
    })
    .addRoute('/about', () => {
      about.render(inner);
      home.update();
    })
    .addRoute('/articles', () => {
      articles.render(inner);
      home.update();
    });

  store.subscribe(() => {
    document.body.dataset.theme = store.getState().theme;
    home.update();

    const currentPath = window.location.hash.slice(1) || '/';
    console.log("strore update", currentPath);
    if (currentPath == "/articles") {
      articles.render(inner);
    }
  });
}

await runApp(document.body);