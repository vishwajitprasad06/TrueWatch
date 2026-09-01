import { useParams, useNavigate } from "react-router-dom";
import { Play, Star, Check, ListVideo, Share2 } from "lucide-react";
import MovieReviews from "../components/MovieReviews";
import { useState, useEffect } from "react";
import { movies as staticMovies } from "../data/movies";
import BackButton from "../components/BackButton";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [selectedAudioLang, setSelectedAudioLang] = useState("Hindi");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/movies`);
        const dbMovies = await res.json();

        const localMovies = JSON.parse(localStorage.getItem("customMovies")) || [];
        const allMovies = [...(Array.isArray(dbMovies) ? dbMovies : []), ...localMovies, ...staticMovies];

        const foundMovie = allMovies.find(
          (item) => String(item._id) === String(id) || String(item.id) === String(id)
        );

        if (foundMovie) {
          setMovie(foundMovie);
          if (foundMovie.language) {
            setSelectedAudioLang(foundMovie.language);
          }
        }
      } catch (err) {
        console.log("Error fetching movie details from backend:", err);
        const localMovies = JSON.parse(localStorage.getItem("customMovies")) || [];
        const allMovies = [...localMovies, ...staticMovies];
        const foundMovie = allMovies.find((item) => String(item._id) === String(id) || String(item.id) === String(id));
        if (foundMovie) setMovie(foundMovie);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    if (movie) {
      const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
      const movieId = movie._id || movie.id;
      const isExist = watchlist.some((item) => String(item._id || item.id) === String(movieId));
      setIsInWatchlist(isExist);
    }
  }, [movie]);

  const toggleWatchlist = () => {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const movieId = movie._id || movie.id;
    
    if (isInWatchlist) {
      watchlist = watchlist.filter((item) => String(item._id || item.id) !== String(movieId));
      setIsInWatchlist(false);
      alert("Removed from Watchlist");
    } else {
      watchlist.push(movie);
      setIsInWatchlist(true);
      alert("Added to Watchlist! ⭐");
    }

    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie?.title,
        text: `Check out ${movie?.title} on TrueWatch!`,
        url: window.location.href,
      }).catch((err) => console.log(err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard! 📋");
    }
  };

  if (loading) {
    return (
      <div className="page" style={{ textAlign: "center", padding: "50px", color: "#888" }}>
        <h2>Loading content...</h2>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="page">
        <BackButton />
        <h1 style={{ padding: "20px 5%" }}>Movie or Series not found</h1>
      </div>
    );
  }

  const isSeriesOrAudio = movie.episodes && movie.episodes.length > 0;
  const movieIdKey = movie._id || movie.id;

  return (
    <>
      <div className="details-page" style={{ paddingBottom: "60px" }}>
        <BackButton />
        
        <div className="details-hero">
          <div className="details-poster">
            {movie.poster ? (
              <img src={movie.poster} alt={movie.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }} />
            ) : (
              <Play size={45} fill="white" />
            )}
          </div>

          <div className="details-info">
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
              <span className="details-category">{movie.category}</span>
              <span style={{ background: isSeriesOrAudio ? "#e50914" : "#333", color: "white", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>
                {isSeriesOrAudio ? "📺 Series / Audio Story" : "🎬 Movie"}
              </span>
            </div>

            <h1>{movie.title}</h1>

            <div className="details-meta">
              <span><Star size={17} fill="currentColor" /> {movie.rating}</span>
              <span>{movie.year}</span>
              <span>{movie.duration}</span>
              <span>{movie.language}</span>
            </div>

            <p>{movie.description}</p>

            <div style={{ margin: "15px 0", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "13px", color: "#aaa" }}>Audio Language:</span>
              <select
                value={selectedAudioLang}
                onChange={(e) => setSelectedAudioLang(e.target.value)}
                style={{ background: "#171717", color: "white", border: "1px solid #333", padding: "6px 12px", borderRadius: "6px", outline: "none", fontSize: "13px", cursor: "pointer" }}
              >
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Japanese">Japanese</option>
                <option value="Telugu">Telugu</option>
                <option value="Tamil">Tamil</option>
                <option value="Korean">Korean</option>
              </select>
            </div>

            <div className="details-buttons" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <button
                className="watch-btn"
                onClick={() => navigate(`/watch/${movieIdKey}?audio=${selectedAudioLang}`)}
              >
                <Play size={19} fill="white" /> Watch Now
              </button>

              <button 
                className="watchlist-btn"
                onClick={toggleWatchlist}
                style={{ background: isInWatchlist ? "#333" : "#222" }}
              >
                {isInWatchlist ? <Check size={18} /> : "+"} {isInWatchlist ? "In Watchlist" : "Watchlist"}
              </button>

              <button 
                className="watchlist-btn"
                onClick={handleShare}
                style={{ background: "#222", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>
        </div>

        {isSeriesOrAudio && (
          <section style={{ maxWidth: "900px", margin: "30px auto 0 auto", padding: "0 5%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
              <ListVideo size={20} color="#e50914" />
              <h3 style={{ fontSize: "18px", margin: 0 }}>Episodes & Audio Parts</h3>
            </div>
            
            <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "10px" }}>
              {movie.episodes.map((ep, index) => (
                <button
                  key={index}
                  onClick={() => navigate(`/watch/${movieIdKey}?audio=${selectedAudioLang}&ep=${index}`)}
                  style={{
                    background: "#171717",
                    color: "white",
                    border: "1px solid #333",
                    padding: "12px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Play size={14} fill="#e50914" color="#e50914" /> Episode {ep.epNum}
                </button>
              ))}
            </div>
          </section>
        )}

        <MovieReviews movieId={movieIdKey} />
      </div>
    </>
  );
}

export default MovieDetails;