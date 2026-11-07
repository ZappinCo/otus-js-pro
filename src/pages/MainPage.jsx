
import useLocalStorage from "../store/useLocalStorage";

export function MainPage() {

    const [savedArticles,] = useLocalStorage('savedArticles',[]);
    const [user,] = useLocalStorage('userEmail');
    const [theme,] = useLocalStorage('theme');

    return (
        <div className="article-card">
            <p>Современные паттерны в React и кастомные хуки</p>
            <p className="home-status">
                {`${user ? `Вошли как ${user}` : 'Гость'} Тема: ${theme}  Избранное: ${savedArticles.length}`}</p>
        </div>
    )
}