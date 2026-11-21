import { screen } from '@testing-library/react';
import MainPage from '../pages/MainPage';
import { renderWithProviders, sampleArticles } from './testUtils';

describe('MainPage', () => {
  it('показывает состояние «гость»', () => {
    renderWithProviders(<MainPage />, {
      preloadedState: { user: '', theme: 'light', articles: sampleArticles },
    });
    expect(screen.getByText(/Гость/)).toBeInTheDocument();
    expect(screen.getByText(/Тема: light/)).toBeInTheDocument();
    expect(screen.getByText(/Избранное: 0/)).toBeInTheDocument();
  });

  it('показывает email и количество избранных', () => {
    renderWithProviders(<MainPage />, {
      preloadedState: {
        user: 'a@b.c',
        theme: 'dark',
        articles: { ...sampleArticles, saved: [1, 2] },
      },
    });
    expect(screen.getByText(/Вошли как a@b.c/)).toBeInTheDocument();
    expect(screen.getByText(/Тема: dark/)).toBeInTheDocument();
    expect(screen.getByText(/Избранное: 2/)).toBeInTheDocument();
  });
});