import { Link, useLocation, Outlet } from "react-router"
import { ThemeButton } from "./theme/ThemeButton"
import { Loader } from "./components/Loader";
import { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./store/slices/userSlice";

export function App() {
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

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
            <button className="home-btn home-btn-logout" onClick={() => { dispatch(login('')) }}>Выйти</button>
          }
        </nav>
      </div>
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </div>

  )
}
