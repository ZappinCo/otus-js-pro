import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import themeReducer from '../store/slices/themeSlice';
import userReducer from '../store/slices/userSlice';
import articlesReducer from '../store/slices/articlesSlice';

export const baseState = {
  theme: 'light',
  user: '',
  articles: { saved: [], all: [] },
};

export const sampleArticles = {
  saved: [],
  all: [
    { id: 1, title: 'Статья 1', summary: 'Summary 1' },
    { id: 2, title: 'Статья 2', summary: 'Summary 2' },
    { id: 3, title: 'Статья 3', summary: 'Summary 3' },
  ],
};

export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      theme: themeReducer,
      user: userReducer,
      articles: articlesReducer,
    },
    preloadedState: { ...baseState, ...preloadedState },
  });
}

export function renderWithProviders(
  ui,
  { preloadedState = {}, route = '/', path = '/', extraRoutes = [] } = {}
) {
  const store = createTestStore(preloadedState);
  const result = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={path} element={ui} />
          {extraRoutes.map((r, i) => (
            <Route key={i} path={r.path} element={r.element} />
          ))}
        </Routes>
      </MemoryRouter>
    </Provider>
  );
  return { ...result, store };
}