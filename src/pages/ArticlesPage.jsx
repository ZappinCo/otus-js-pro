import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSavedArticle } from '../store/slices/articlesSlice';
import { useNavigate } from 'react-router';

export default function ArticlesPage() {
  const [saved, setSave] = useState(false);
  const articles = useSelector((state) => state.articles);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const visible = saved ?
    articles.all.filter(a => articles.saved.includes(a.id)) :
    articles.all;

  const toggleSaved = (e, article) => {
    e.stopPropagation();
    dispatch(toggleSavedArticle(article.id));
  }

  return (
    <div className="articles-page">
      <div className="articles-content">
        <div className="articles-top-nav">
          <h1>Статьи</h1>
        </div>
        <div className="articles-filter">
          <button className={`filter-btn ${!saved ? 'active' : ''}`} onClick={() => { setSave(false) }}>Все</button>
          <button className={`filter-btn ${saved ? 'active' : ''}`} onClick={() => { setSave(true) }}>Избранное</button>
        </div>
        <div className="articles-list">
          {visible.length === 0 ?
            <p>Пока нет статей в избранном.</p> :
            visible.map((article) => {
              const isSaved = articles.saved.length ? articles.saved.includes(article.id) : false
              return (
                <div className="article-card" key={article.id} onClick={() => {
                  navigate(`/articles/${article.id}`)
                }}>
                  <h2>{article.title}</h2>
                  <p>{article.summary}</p>
                  <button className={`article-read-btn  ${isSaved ? ' saved' : ''}`}
                    onClick={(e) => toggleSaved(e, article)}>
                    {isSaved ? '★ В избранном' : '☆ В избранное'}
                  </button>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}