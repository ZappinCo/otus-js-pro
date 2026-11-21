import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OneArticlePage from '../pages/OneArticlePage';
import { renderWithProviders, sampleArticles } from './testUtils';

const renderArticle = (id = 1, preloadedState = {}) =>
  renderWithProviders(<OneArticlePage />, {
    route: `/articles/${id}`,
    path: '/articles/:id',
    preloadedState: { articles: sampleArticles, ...preloadedState },
    extraRoutes: [{ path: '/articles', element: <div>Articles list</div> }],
  });

describe('OneArticlePage', () => {
  it('рендерит статью по id', () => {
    renderArticle(1);
    expect(screen.getByRole('heading', { name: 'Статья 1' })).toBeInTheDocument();
    expect(screen.getByText('Summary 1')).toBeInTheDocument();
  });

  it('показывает "Статья не найдена" для несуществующего id', () => {
    renderArticle(999);
    expect(screen.getByText('Статья не найдена')).toBeInTheDocument();
  });

  it('показывает состояние "В избранном", если сохранена', () => {
    renderArticle(1, { articles: { ...sampleArticles, saved: [1] } });
    expect(screen.getByRole('button', { name: /★ В избранном/i })).toBeInTheDocument();
  });

  it('переключает избранное', async () => {
    const user = userEvent.setup();
    const { store } = renderArticle(1);
    await user.click(screen.getByRole('button', { name: /☆ В избранное/i }));
    expect(store.getState().articles.saved).toEqual([1]);
  });

  it('кнопка "Назад к статьям" ведёт на /articles', async () => {
    const user = userEvent.setup();
    renderArticle(1);
    await user.click(screen.getByRole('button', { name: /назад к статьям/i }));
    expect(screen.getByText('Articles list')).toBeInTheDocument();
  });

  it('кнопка "Назад к статьям" работает и для "не найдено"', async () => {
    const user = userEvent.setup();
    renderArticle(999);
    await user.click(screen.getByRole('button', { name: /назад к статьям/i }));
    expect(screen.getByText('Articles list')).toBeInTheDocument();
  });
});