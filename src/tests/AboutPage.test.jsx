import { screen } from '@testing-library/react';
import AboutPage from '../pages/AboutPage';
import { renderWithProviders, sampleArticles } from './testUtils';

describe('AboutPage', () => {
  it('рендерит заголовок и данные по умолчанию', () => {
    renderWithProviders(<AboutPage />, {
      preloadedState: { articles: sampleArticles },
    });
    expect(screen.getByText('О приложении')).toBeInTheDocument();
    expect(screen.getByText(/Пользователь: гость/)).toBeInTheDocument();
    expect(screen.getByText(/Тема: light/)).toBeInTheDocument();
    expect(screen.getByText(/Избранных статей: 0/)).toBeInTheDocument();
  });

  it('показывает email и счётчик избранного', () => {
    renderWithProviders(<AboutPage />, {
      preloadedState: {
        user: 'x@y.z',
        theme: 'dark',
        articles: { ...sampleArticles, saved: [1, 2, 3] },
      },
    });
    expect(screen.getByText(/Пользователь: x@y.z/)).toBeInTheDocument();
    expect(screen.getByText(/Избранных статей: 3/)).toBeInTheDocument();
  });
});