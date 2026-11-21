import articlesReducer, { toggleSavedArticle } from '../store/slices/articlesSlice';

describe('articlesSlice', () => {
  const base = { saved: [], all: [{ id: 1 }, { id: 2 }] };

  it('добавляет id в saved', () => {
    const state = articlesReducer(base, toggleSavedArticle(1));
    expect(state.saved).toEqual([1]);
  });

  it('удаляет id из saved, если уже там', () => {
    const withSaved = { ...base, saved: [1, 2] };
    const state = articlesReducer(withSaved, toggleSavedArticle(2));
    expect(state.saved).toEqual([1]);
  });

  it('не мутирует исходное состояние', () => {
    const withSaved = { ...base, saved: [] };
    articlesReducer(withSaved, toggleSavedArticle(1));
    expect(withSaved.saved).toEqual([]);
  });
});