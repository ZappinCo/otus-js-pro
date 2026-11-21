import themeReducer, { toggleTheme, setTheme } from '../store/slices/themeSlice';

describe('themeSlice', () => {
  it('toggleTheme переключает light -> dark', () => {
    expect(themeReducer('light', toggleTheme())).toBe('dark');
  });

  it('toggleTheme переключает dark -> light', () => {
    expect(themeReducer('dark', toggleTheme())).toBe('light');
  });

  it('setTheme устанавливает тему', () => {
    expect(themeReducer('light', setTheme('dark'))).toBe('dark');
  });
});