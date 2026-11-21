import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import LoginPage from '../pages/LoginPage';
import { renderWithProviders } from './testUtils';

describe('LoginPage', () => {
  let alertSpy;

  beforeEach(() => {
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
  });
  afterEach(() => {
    alertSpy.mockRestore();
  });

  const renderLogin = () =>
    renderWithProviders(<LoginPage />, {
      route: '/login',
      path: '/login',
      extraRoutes: [{ path: '/', element: <div>Home page</div> }],
    });

  it('рендерит поля и кнопку', () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument();
  });

  it('поля обязательны (HTML-валидация)', () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeRequired();
    expect(screen.getByLabelText(/пароль/i)).toBeRequired();
  });

  it('alert при отправке пустой формы (обход нативной валидации)', () => {
    renderLogin();
    fireEvent.submit(document.querySelector('form'));
    expect(alertSpy).toHaveBeenCalledWith('Заполните все поля');
  });

  it('логинит и редиректит на "/"', async () => {
    const user = userEvent.setup();
    const { store } = renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/пароль/i), 'password123');
    await user.click(screen.getByRole('button', { name: /войти/i }));

    expect(store.getState().user).toBe('test@example.com');
    expect(await screen.findByText('Home page')).toBeInTheDocument();
  });
});