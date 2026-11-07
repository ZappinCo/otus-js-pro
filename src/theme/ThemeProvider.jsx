import useLocalStorage from '../store/useLocalStorage';
import { useMemo } from 'react';
import { ThemeContext } from './ThemeContext'

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useLocalStorage('theme', 'light');

    const value = useMemo(() => ({
        theme,
        setTheme,
        toggleTheme: () => setTheme(theme === 'light' ? 'dark' : 'light'),
        isDark: theme == 'dark'
    }), [theme, setTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}
