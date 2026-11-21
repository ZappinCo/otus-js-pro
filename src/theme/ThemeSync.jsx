import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export function ThemeSync() {
  const theme = useSelector((state) => state.theme);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return null;
}