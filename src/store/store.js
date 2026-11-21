import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import userReducer from './slices/userSlice';
import articlesReducer from './slices/articlesSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    articles: articlesReducer,
  },
});

store.subscribe(() => {
  try {
    const state = store.getState();
    const stateToSave = {
      theme: state.theme,
      userEmail: state.user,
      savedArticles: state.articles.saved,
    };
    localStorage.setItem('spa-routing-state', JSON.stringify(stateToSave));
  } catch (e) {
    console.warn('Не удалось сохранить состояние в localStorage', e);
  }
});