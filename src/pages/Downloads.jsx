import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import MovieCard from "../components/MovieCard";
import { movies as staticMovies } from "../data/movies";
import { Download, Crown } from "lucide-react";

function Downloads() {
  const navigate = useNavigate();
  const [downloadedMovies, setDownloadedMovies] = useState([]);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Check karein ki user VIP Premium hai ya nahi
    const premiumStatus = JSON.parse(localStorage.getItem("isPremium")) || false;
    setIsPremium(premiumStatus);

    if (premiumStatus) {
      // LocalStorage se download IDs load karein
      const downloadIds = JSON.parse(localStorage.getItem("downloadedMovies")) || [];
      const localMovies = JSON.parse(localStorage.getItem("customMovies")) || [];
      const allMovies = [...localMovies, ...staticMovies];

      const matchedMovies = downloadIds
        .map((id) => allMovies.find((m) => m.id === id))
        .filter((m) => m !== undefined);

      setDownloadedMovies(matchedMovies);
    }
  }, []);

  return (
    <main className="page" style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "60px" }}>
      <BackButton />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 5%" }}>
        <div>
          <h1>My Downloads</h1>
          <p style={{ color: "#aaa" }}>Offline accessible movies and audio stories</p>
        </div>
      </div>

      <div style={{ padding: "0 5%" }}>
        {isPremium ? (
          downloadedMovies.length > 0 ? (
            <div className="movie-grid">
              {downloadedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#888" }}>
              <Download size={48} color="#e50914" style={{ marginBottom: "15px" }} />
              <h3>No Downloads Found</h3>
              <p>Browse movies or audio stories and click download to save them offline.</p>
            </div>
          )
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "#171717", borderRadius: "12px", border: "1px solid #292929" }}>
            <Crown size={48} color="#e50914" style={{ marginBottom: "15px" }} />
            <h3>Premium Feature</h3>
            <p style={{ color: "#aaa", maxWidth: "400px", margin: "10px auto 20px auto" }}>
              Offline downloads are exclusively available for TrueWatch VIP Premium members. Upgrade your account using coins to unlock downloads!
            </p>
            <button
              onClick={() => navigate("/premium")}
              style={{ background: "#e50914", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
            >
              Get Premium Now
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default Downloads;