import { useSelector } from "react-redux";

export default function MainPage() {

    const user = useSelector((state) => state.user);
    const theme = useSelector((state) => state.theme);
    const savedArticles = useSelector((state) => state.articles);

    return (
        <div className="article-card">
            <p>Современные паттерны в React и кастомные хуки</p>
            <p className="home-status">
                {`${user ? `Вошли как ${user}` : 'Гость'} Тема: ${theme}  Избранное: ${savedArticles.saved.length}`}</p>
        </div>
    )
}