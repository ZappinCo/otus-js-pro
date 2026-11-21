import { store } from '../store/store';
import { login } from '../store/slices/userSlice';
import { toggleTheme } from '../store/slices/themeSlice';
import { toggleSavedArticle } from '../store/slices/articlesSlice';

describe('store persistence', () => {
  it('сохраняет email пользователя в localStorage', () => {
    store.dispatch(login('test@example.com'));
    const saved = JSON.parse(localStorage.getItem('spa-routing-state'));
    expect(saved.userEmail).toBe('test@example.com');
  });

  it('сохраняет тему', () => {
    store.dispatch(toggleTheme());
    const saved = JSON.parse(localStorage.getItem('spa-routing-state'));
    expect(['light', 'dark']).toContain(saved.theme);
  });

  it('сохраняет избранные статьи', () => {
    store.dispatch(toggleSavedArticle(999));
    const saved = JSON.parse(localStorage.getItem('spa-routing-state'));
    expect(saved.savedArticles).toContain(999);
  });
});