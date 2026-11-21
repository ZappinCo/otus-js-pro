import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { ThemeButton } from '../theme/ThemeButton';
import { createTestStore } from './testUtils';

const renderBtn = (theme) => {
  const store = createTestStore({ theme });
  render(
    <Provider store={store}>
      <ThemeButton />
    </Provider>
  );
  return store;
};

describe('ThemeButton', () => {
  it('показывает 🌙 в светлой теме', () => {
    renderBtn('light');
    expect(screen.getByRole('button')).toHaveTextContent('🌙');
  });

  it('показывает ☀️ в тёмной теме', () => {
    renderBtn('dark');
    expect(screen.getByRole('button')).toHaveTextContent('☀️');
  });

  it('переключает тему по клику', async () => {
    const user = userEvent.setup();
    const store = renderBtn('light');
    await user.click(screen.getByRole('button'));
    expect(store.getState().theme).toBe('dark');
  });
});