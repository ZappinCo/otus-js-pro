import useLocalStorage from "../store/useLocalStorage.js";

export function AboutPage() {
  const [savedArticles,] = useLocalStorage('savedArticles');
  const [user,] = useLocalStorage('userEmail');
  const [theme,] = useLocalStorage('theme');

  let data = [
    ['Пользователь', user ? user : 'гость'],
    ['Тема', theme],
    ['Избранных статей', String(savedArticles.length)]
  ];

  return <div className="about-page">
    <div className="about-content">
      <div className="about-top-nav">
        <h1>О приложении</h1>
      </div>
      <div className="about-section">
        <h2>О проекте</h2>
        <p>Версия: 2.0.0</p> 
        <p> Разработано в рамках домашнего задания: Современные паттерны в React и кастомные хуки</p>

        <h2>Текущее состояние (store)</h2>
        <ul>
          {data.map(([label, value]) => <li key={label}>{label}: {value}</li>)}
        </ul>
      </div>
    </div>
  </div>
}