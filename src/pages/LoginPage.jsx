import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { login } from "../store/slices/userSlice";

export default function LoginPage() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;
    if (!email || !password) {
      alert('Заполните все поля');
      return;
    }
    dispatch(login(email));
    navigate("/")
  };

  return (
    <div className="login-page">
      <div className="login-content">
        <div className="login-top-nav">
          <h1>Вход в систему</h1>
        </div>
        <form action="" className="login-form" onSubmit={onSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className=""
            placeholder="example@mail.com"
            id="email"
            required={true}
            ref={emailRef}
          />
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            className=""
            placeholder="••••••••"
            id="password"
            required={true}
            ref={passwordRef}
          />
          <button className="login-submit-btn" type='submit'> Войти</button>
        </form>
      </div>
    </div>
  )
}