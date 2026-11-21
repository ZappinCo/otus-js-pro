import { useParams, useNavigate } from "react-router";
import { toggleSavedArticle } from "../store/slices/articlesSlice";
import { useDispatch, useSelector } from "react-redux";

export default function OneArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const articles = useSelector((state) => state.articles);

  const numericId = Number(id);
  const article = articles.all.find((article) => article.id === numericId);
  const isSaved = articles.saved.includes(numericId);

  if (!article) {
    return (
      <div className="about-page">
        <div className="about-content">
          <h1>Статья не найдена</h1>
          <button className="back-home-btn" onClick={() => navigate("/articles")}>
            Назад к статьям
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="about-page">
      <div className="about-content">
        <div className="about-top-nav">
          <button className="back-home-btn" onClick={() => navigate("/articles")}>
            Назад к статьям
          </button>
          <h1>{article.title}</h1>
        </div>
        <div className="about-section">
          <p>{article.summary}</p>
          <button
            className={`article-read-btn ${isSaved ? ' saved' : ''}`}
            onClick={() => dispatch(toggleSavedArticle(numericId))}
          >
            {isSaved ? '★ В избранном' : '☆ В избранное'}
          </button>
        </div>
      </div>
    </div>
  );
}