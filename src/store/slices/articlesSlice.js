import { createSlice } from '@reduxjs/toolkit';

const getSavedArticles = () => {
  try {
    const state = JSON.parse(localStorage.getItem('spa-routing-state'));
    return state?.savedArticles || [];
  } catch { return []; }
};
const initial = () => {
  return {
    saved: getSavedArticles(),
    all: [
      { id: 1, title: 'Статья 1', summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed tellus consequat, maximus sem id, interdum erat.' },
      { id: 2, title: 'Статья 2', summary: 'Donec vehicula metus id dui fringilla aliquam. Praesent eu metus eros.' },
      { id: 3, title: 'Статья 3', summary: 'Suspendisse pharetra gravida nisl. Nunc tempor at turpis vel pretium.' },
    ]
  }
}

const articlesSlice = createSlice({
  name: 'articles',
  initialState: initial(),
  reducers: {
    toggleSavedArticle: (state, action) => {
      const id = action.payload;
      if (state.saved.includes(id)) {
        state.saved = state.saved.filter(articleId => articleId !== id);
      } else {
        state.saved.push(id);
      }
    },
  },
});
export const { toggleSavedArticle } = articlesSlice.actions;
export default articlesSlice.reducer;