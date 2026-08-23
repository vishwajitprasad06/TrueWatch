import BackButton from "../components/BackButton";
import MovieCard from "../components/MovieCard";

function Watchlist() {
  const watchlistMovies = JSON.parse(localStorage.getItem("watchlist")) || [];

  return (
    <main className="page">
      <BackButton />
      
      <div className="category-section" style={{ paddingTop: "10px" }}>
        <div className="section-title">
          <h2>My Watchlist</h2>
          <span>{watchlistMovies.length} saved titles</span>
        </div>

        {watchlistMovies.length > 0 ? (
          <div className="movie-grid">
            {watchlistMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Your watchlist is empty</h3>
            <p>Browse movies and add them to your watchlist.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Watchlist;