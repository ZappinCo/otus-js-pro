import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../store/slices/themeSlice";

export function ThemeButton() {
    const theme = useSelector((state) => state.theme);
    const dispatch = useDispatch();

    return (
        <button
            className="home-btn home-btn-theme"
            onClick={() => dispatch(toggleTheme())}
        >
            {theme === 'dark' ? '☀️' : '🌙'}
        </button>
    )
}