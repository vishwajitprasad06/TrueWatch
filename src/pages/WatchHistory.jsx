import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import MovieCard from "../components/MovieCard";
import { movies as staticMovies } from "../data/movies";
import { Trash2 } from "lucide-react";

function WatchHistory() {
  const navigate = useNavigate();
  const [historyMovies, setHistoryMovies] = useState([]);

  useEffect(() => {
    // LocalStorage se watch history IDs load karein
    const historyIds = JSON.parse(localStorage.getItem("watchHistory")) || [];
    const localMovies = JSON.parse(localStorage.getItem("customMovies")) || [];
    const allMovies = [...localMovies, ...staticMovies];

    // History IDs ko actual movie objects mein map karein
    const matchedMovies = historyIds
      .map((id) => allMovies.find((m) => m.id === id))
      .filter((m) => m !== undefined);

    setHistoryMovies(matchedMovies);
  }, []);

  // Clear Watch History Handler
  const handleClearHistory = () => {
    localStorage.removeItem("watchHistory");
    setHistoryMovies([]);
    alert("Watch history cleared successfully! 🗑️");
  };

  return (
    <main className="page" style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "60px" }}>
      <BackButton />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 5%" }}>
        <div>
          <h1>Watch History</h1>
          <p style={{ color: "#aaa" }}>Movies and shows you have recently watched</p>
        </div>
        {historyMovies.length > 0 && (
          <button
            onClick={handleClearHistory}
            style={{
              background: "#1f1f1f",
              color: "#e50914",
              border: "1px solid #333",
              padding: "10px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItem: "center",
              gap: "8px",
              fontWeight: "bold"
            }}
          >
            <Trash2 size={16} /> Clear History
          </button>
        )}
      </div>

      <div style={{ padding: "0 5%" }}>
        {historyMovies.length > 0 ? (
          <div className="movie-grid">
            {historyMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#888" }}>
            <h3>No Watch History Found</h3>
            <p>Start watching movies or audio stories to see them here!</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default WatchHistory;