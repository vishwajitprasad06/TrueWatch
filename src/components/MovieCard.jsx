import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <article
      className="movie-card"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <div className="movie-poster">
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
        />

        <div className="movie-overlay">
          <div className="play-circle">
            <Play size={22} fill="white" />
          </div>
        </div>

        <span className="quality-badge">
          HD
        </span>
      </div>

      <div className="movie-language">
        {movie.language}
      </div>

      <h3>{movie.title}</h3>

      <div className="movie-meta">
        ⭐ {movie.rating} · {movie.duration}
      </div>
    </article>
  );
}

export default MovieCard;