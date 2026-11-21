import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArticlesPage from '../pages/ArticlesPage';
import { renderWithProviders, sampleArticles } from './testUtils';

const renderPage = (preloadedState = {}) =>
  renderWithProviders(<ArticlesPage />, {
    route: '/articles',
    path: '/articles',
    preloadedState: { articles: sampleArticles, ...preloadedState },
    extraRoutes: [{ path: '/articles/:id', element: <div>Article detail</div> }],
  });

describe('ArticlesPage', () => {
  it('показывает все статьи по умолчанию', () => {
    renderPage();
    expect(screen.getByText('Статья 1')).toBeInTheDocument();
    expect(screen.getByText('Статья 2')).toBeInTheDocument();
    expect(screen.getByText('Статья 3')).toBeInTheDocument();
  });

  it('фильтр «Избранное» показывает пустое состояние', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Избранное' }));
    expect(screen.getByText('Пока нет статей в избранном.')).toBeInTheDocument();
  });

  it('фильтр «Избранное» показывает сохранённые', async () => {
    const user = userEvent.setup();
    renderPage({ articles: { ...sampleArticles, saved: [2] } });
    await user.click(screen.getByRole('button', { name: 'Избранное' }));
    expect(screen.getByText('Статья 2')).toBeInTheDocument();
    expect(screen.queryByText('Статья 1')).not.toBeInTheDocument();
  });

  it('кнопка "В избранное" добавляет статью в saved', async () => {
    const user = userEvent.setup();
    const { store } = renderPage();
    const buttons = screen.getAllByRole('button', { name: /в избранное/i });
    await user.click(buttons[0]);
    expect(store.getState().articles.saved).toEqual([1]);
    expect(screen.getByText(/★ В избранном/)).toBeInTheDocument();
  });

  it('кнопка "В избранном" удаляет из saved', async () => {
    const user = userEvent.setup();
    const { store } = renderPage({ articles: { ...sampleArticles, saved: [1] } });
    await user.click(screen.getByRole('button', { name: /★ В избранном/i }));
    expect(store.getState().articles.saved).toEqual([]);
  });

  it('переход на карточку ведёт к детальной странице', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByText('Статья 1'));
    expect(screen.getByText('Article detail')).toBeInTheDocument();
  });
});