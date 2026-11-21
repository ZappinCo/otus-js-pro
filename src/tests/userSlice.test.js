import userReducer, { login, logout } from '../store/slices/userSlice';

describe('userSlice', () => {
  it('login сохраняет email', () => {
    expect(userReducer('', login('a@b.c'))).toBe('a@b.c');
  });

  it('logout очищает пользователя', () => {
    expect(userReducer('a@b.c', logout())).toBe('');
  });
});