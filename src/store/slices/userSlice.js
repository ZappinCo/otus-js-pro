import { createSlice } from '@reduxjs/toolkit';

const getUser = () => {
  try {
    const state = JSON.parse(localStorage.getItem('spa-routing-state'));
    return state?.userEmail || '';
  } catch { return ''; }
};

const userSlice = createSlice({
  name: 'user',
  initialState: getUser(),
  reducers: {
    login: (state, action) => action.payload,
    logout: () => '',
  },
});
export const { login, logout } = userSlice.actions;
export default userSlice.reducer;