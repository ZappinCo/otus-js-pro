import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  try {
    const state = JSON.parse(localStorage.getItem('spa-routing-state'));
    return state?.theme || 'light';
  } catch { return 'light'; }
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: getInitialTheme(),
  reducers: {
    toggleTheme: (state) => state === 'light' ? 'dark' : 'light',
    setTheme: (state, action) => action.payload,
  },
});
export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;