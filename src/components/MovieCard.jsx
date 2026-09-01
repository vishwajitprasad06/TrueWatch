import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

function MovieCard({ movie }) {
  const navigate = useNavigate();
  // MongoDB ki _id ya static id mein se jo bhi available ho, use karein
  const cardId = movie._id || movie.id;

  return (
    <article
      className="movie-card"
      onClick={() => navigate(`/movie/${cardId}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="movie-poster" style={{ aspectRatio: "2/3", overflow: "hidden", borderRadius: "8px", background: "#1a1a1a", position: "relative" }}>
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover" }} // Yeh line cards ka size ek jaisa karegi!
        />

        <div className="movie-overlay">
          <div className="play-circle">
            <Play size={22} fill="white" />
          </div>
        </div>

        <span className="quality-badge">HD</span>
      </div>

      <div className="movie-language">{movie.language || "Japanese"}</div>

      <h3 style={{ fontSize: "15px", margin: "4px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {movie.title}
      </h3>

      <div className="movie-meta">
        ⭐ {movie.rating || "8.0"} · {movie.duration || "24m"}
      </div>
    </article>
  );
}

export default MovieCard;