import { useEffect } from 'react';
import { useTheme } from './ThemeContext';

export function ThemeSync() {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return null;
}