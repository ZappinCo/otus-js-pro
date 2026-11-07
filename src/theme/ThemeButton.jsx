import { useTheme } from "./ThemeContext";
export function ThemeButton() {
    const { isDark, toggleTheme } = useTheme();
    return <button className="home-btn home-btn-theme" onClick={toggleTheme}>{isDark ? '☀️' : '🌙'}</button>
}