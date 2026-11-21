import { Link, Routes, Route, useLocation } from "react-router"
import { AboutPage } from "./pages/AboutPage"
import { ArticlesPage } from "./pages/ArticlesPage"
import { LoginPage } from "./pages/LoginPage"
import { MainPage } from "./pages/MainPage"
import { ThemeButton } from "./theme/ThemeButton"
import useLocalStorage from "./store/useLocalStorage"

export function App() {
  const location = useLocation();
  const [user, setUser] = useLocalStorage('userEmail');

  return (
    <div className="home-page">
      <div className="home-content">
        <div className="header-buttons">
          {location.pathname !== "/" && <Link to="/" className="back-home-btn">На главную</Link>}
          <h1>Routing</h1>
          <ThemeButton />
        </div>
        <nav className="home-buttons">
          <Link to="/about" className="home-btn home-btn-about">О проекте</Link>
          <Link to="/articles" className="home-btn home-btn-articles">Статьи</Link>
          {!user ?
            <Link to="/login" className="home-btn home-btn-login">Логин</Link> :
            <button className="home-btn home-btn-logout" onClick={()=>{setUser('')}}>Выйти</button>
          }
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>

  )
}
