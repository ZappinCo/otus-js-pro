import { useState } from 'react';
import useLocalStorage from '../store/useLocalStorage.js';

export function ArticlesPage() {
  const [saved, setSave] = useState(false);
  const [savedArticles, setSavedArticles] = useLocalStorage('savedArticles', []);


  const articles = [
    { id: 1, title: 'Статья 1', summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed tellus consequat, maximus sem id, interdum erat.' },
    { id: 2, title: 'Статья 2', summary: 'Donec vehicula metus id dui fringilla aliquam. Praesent eu metus eros.' },
    { id: 3, title: 'Статья 3', summary: 'Suspendisse pharetra gravida nisl. Nunc tempor at turpis vel pretium.' },
  ];

  const visible = saved ?
    articles.filter(a => savedArticles.includes(a.id)) :
    articles;

  const toggleSaved = (article) => {
    setSavedArticles(savedArticles.includes(article.id)
      ? savedArticles.filter(id => id !== article.id)
      : [...savedArticles, article.id]);
  }

  return (
    <div className="articles-page">
      <div className="articles-content">
        <div className="articles-top-nav">
          <h1>Статьи</h1>
        </div>
        <div className="articles-filter">
          <button className={`filter-btn ${!saved ? 'active' : ''}`} onClick={()=>{setSave(false)}}>Все</button>
          <button className={`filter-btn ${saved ? 'active' : ''}`} onClick={()=>{setSave(true)}}>Избранное</button>
        </div>
        <div className="articles-list">
          {visible.length === 0 ?
            <p>Пока нет статей в избранном.</p> :
            visible.map((article) => {
              const isSaved = savedArticles.includes(article.id)
              return (
                <div className="article-card" key={article.id}>
                  <h2>{article.title}</h2>
                  <p>{article.summary}</p>
                  <button className={`article-read-btn  ${isSaved ? ' saved' : ''}`}
                    onClick={() => toggleSaved(article)}>
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