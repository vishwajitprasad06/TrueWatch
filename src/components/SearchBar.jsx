import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { movies as staticMovies } from "../data/movies";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 0) {
      const localMovies = JSON.parse(localStorage.getItem("customMovies")) || [];
      const allMovies = [...localMovies, ...staticMovies];
      
      const filtered = allMovies.filter((m) =>
        m.title.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // Top 5 suggestions
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (movie) => {
    setQuery("");
    setSuggestions([]);
    navigate(`/movie/${movie.id}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}`);
      setSuggestions([]);
    }
  };

  return (
    <div className="group">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="search-icon">
        <g>
          <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
        </g>
      </svg>

      <form onSubmit={handleSearch} style={{ width: "100%" }}>
        <input
          id="query"
          className="input"
          type="search"
          placeholder="Search movies..."
          value={query}
          onChange={handleInputChange}
          name="searchbar"
        />
      </form>

      {/* Suggestion Dropdown */}
      {suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((movie) => (
            <div key={movie.id} className="suggestion-item" onClick={() => handleSelect(movie)}>
              <img src={movie.poster} alt={movie.title} width="30" style={{ height: "40px", objectFit: "cover", borderRadius: "4px" }} />
              <span>{movie.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;