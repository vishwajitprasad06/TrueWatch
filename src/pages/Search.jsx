import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { movies as staticMovies } from "../data/movies";

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const localMovies = JSON.parse(localStorage.getItem("customMovies")) || [];
  const allMovies = [...localMovies, ...staticMovies];

  // Logic: Partial match ke liye .toLowerCase().includes() use karein
  const searchResults = allMovies.filter((movie) =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="page">
      <div className="section-title" style={{ padding: "20px 5%" }}>
        <h2>Results for "{query}"</h2>
        <span>{searchResults.length} movies found</span>
      </div>
      
      {searchResults.length > 0 ? (
        <div className="movie-grid" style={{ padding: "0 5%" }}>
          {searchResults.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No results found for "{query}"</h3>
        </div>
      )}
    </main>
  );
}

export default Search;