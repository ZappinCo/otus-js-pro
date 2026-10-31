import { Store } from './store.js';

const initialState = {
  user: null,
  theme: 'light',
  savedArticles: [],
  articlesFilter: 'all'
};

const PERSIST_KEYS = ['user', 'theme', 'savedArticles'];

export const store = new Store(initialState, PERSIST_KEYS);