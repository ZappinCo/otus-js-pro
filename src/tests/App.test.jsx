import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router';
import { App } from '../App';
import { createTestStore } from './testUtils';

const renderApp = (initialPath = '/', preloadedState = {}) => {
  const store = createTestStore(preloadedState);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<div>Home content</div>} />
            <Route path="about" element={<div>About content</div>} />
            <Route path="articles" element={<div>Articles content</div>} />
            <Route path="login" element={<div>Login content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>
  );
  return store;
};

describe('App', () => {
  it('рендерит навигацию', () => {
    renderApp();
    expect(screen.getByRole('link', { name: /о проекте/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /статьи/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /логин/i })).toBeInTheDocument();
  });

  it('рендерит содержимое Outlet', () => {
    renderApp('/about');
    expect(screen.getByText('About content')).toBeInTheDocument();
  });

  it('скрывает "На главную" на "/"', () => {
    renderApp('/');
    expect(screen.queryByRole('link', { name: /на главную/i })).not.toBeInTheDocument();
  });

  it('показывает "На главную" на вложенных маршрутах', () => {
    renderApp('/about');
    expect(screen.getByRole('link', { name: /на главную/i })).toBeInTheDocument();
  });

  it('показывает "Выйти" для авторизованного пользователя', () => {
    renderApp('/', { user: 'user@example.com' });
    expect(screen.getByRole('button', { name: /выйти/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /логин/i })).not.toBeInTheDocument();
  });

  it('разлогинивает по клику на "Выйти"', async () => {
    const user = userEvent.setup();
    const store = renderApp('/', { user: 'user@example.com' });
    await user.click(screen.getByRole('button', { name: /выйти/i }));
    expect(store.getState().user).toBe('');
    expect(await screen.findByRole('link', { name: /логин/i })).toBeInTheDocument();
  });

  it('переключатель темы присутствует в шапке', () => {
    renderApp();
    const themeBtn = screen.getByRole('button', { name: /🌙|☀️/ });
    expect(themeBtn).toBeInTheDocument();
  });
});