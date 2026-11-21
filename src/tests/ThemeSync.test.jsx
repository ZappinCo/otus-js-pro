import { act, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeSync } from '../theme/ThemeSync';
import { createTestStore } from './testUtils';
import { toggleTheme } from '../store/slices/themeSlice';

describe('ThemeSync', () => {
  it('проставляет data-theme в body при монтировании', () => {
    const store = createTestStore({ theme: 'dark' });
    render(
      <Provider store={store}>
        <ThemeSync />
      </Provider>
    );
    expect(document.body.dataset.theme).toBe('dark');
  });

  it('обновляет data-theme при смене темы', () => {
    const store = createTestStore({ theme: 'light' });
    render(
      <Provider store={store}>
        <ThemeSync />
      </Provider>
    );
    expect(document.body.dataset.theme).toBe('light');

    act(() => {
      store.dispatch(toggleTheme());
    });
    expect(document.body.dataset.theme).toBe('dark');
  });
});