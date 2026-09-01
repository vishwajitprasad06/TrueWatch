import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { movies as staticMovies } from "../data/movies";
import { Search } from "lucide-react";

const categories = [
  "All",
  "Trending",
  "Movies",
  "TV",
  "Anime",
  "Shorts",
  "Kids",
  "Education",
  "Music",
];

const languages = ["All", "Hindi", "English", "Tamil", "Telugu", "Japanese", "Korean"];

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [searchQuery, setSearchQuery] = useState(""); // Naya Search State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [allMovies, setAllMovies] = useState(staticMovies);

  const navigate = useNavigate();

  useEffect(() => {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      fetch(`${API_URL}/api/movies`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            setAllMovies([...data, ...staticMovies]);
          }
        })
        .catch((err) => console.log("Backend offline, using static data:", err));
    }, []);

  const localMovies = JSON.parse(localStorage.getItem("customMovies")) || [];

  // Sirf woh movies jinka isHeroBanner true hai (Max 10)
  const heroBanners = allMovies.filter((m) => m.isHeroBanner).slice(0, 10);
  const activeBanners = heroBanners.length > 0 ? heroBanners : allMovies.slice(0, 5);

  // Auto Slide Effect (Har 1 second = 1000ms mein change hoga)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const currentHero = activeBanners[currentSlide] || allMovies[0];

  // Filtering Logic (Category, Language & Search Query ke sath)
  const filteredMovies = allMovies.filter((movie) => {
    // Agar admin ne visibility OFF ki hai toh hide kar dein
    if (movie.isVisible === false) return false;

    let categoryMatch = true;
    if (selectedCategory === "Trending") {
      categoryMatch = true;
    } else if (selectedCategory !== "All") {
      categoryMatch = movie.category === selectedCategory;
    }

    const languageMatch = selectedLanguage === "All" || movie.language === selectedLanguage;
    const searchMatch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (movie.genre && movie.genre.toLowerCase().includes(searchQuery.toLowerCase()));

    return categoryMatch && languageMatch && searchMatch;
  });

  return (
    <main className="home-page" style={{ paddingBottom: "60px" }}>
      
      {/* Hero Slider Section */}
      <section 
        className="hero"
        style={{ 
          background: currentHero?.poster 
            ? `linear-gradient(to top, #090909 0%, rgba(9, 9, 9, 0.5) 100%), url(${currentHero.poster}) center/cover` 
            : undefined
        }}
      >
        <div className="hero-content" style={{ position: "absolute", bottom: "40px", left: "5%", maxWidth: "600px" }}>
          <span className="hero-badge">🔥 {currentHero?.category || "TRENDING NOW"}</span>
          <h1 style={{ minHeight: "3.6rem", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {currentHero?.title || "Watch Your Favorite Stories"}
          </h1>
          <p style={{ minHeight: "3rem", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {currentHero?.description ? currentHero.description : "Movies, TV Shows, Anime and more."}
          </p>
          
          <button 
            onClick={() => navigate(`/movie/${currentHero.id}`)}
            style={{ marginTop: "10px", background: "#e50914", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
          >
            ▶ Watch Now
          </button>
        </div>

        {/* Manual Slide Dots Navigation */}
        <div style={{ position: "absolute", bottom: "20px", right: "5%", display: "flex", gap: "8px", zIndex: 10 }}>
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: currentSlide === index ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: currentSlide === index ? "#e50914" : "rgba(255,255,255,0.5)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            />
          ))}
        </div>
      </section>

      {/* --- Instant Search Bar Integration --- */}
      <section style={{ padding: "20px 5% 0 5%" }}>
        <div style={{ position: "relative", maxWidth: "400px" }}>
          <Search size={18} color="#888" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Search movies, series, or audio stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              background: "#171717",
              border: "1px solid #333",
              borderRadius: "8px",
              padding: "10px 14px 10px 42px",
              color: "white",
              fontSize: "14px",
              outline: "none"
            }}
          />
        </div>
      </section>

      {/* Categories & Filter Bar */}
      <section className="filter-section">
        <h2>Categories</h2>
        <div className="filter-row">
          {categories.map((cat) => (
            <button
              key={cat}
              className={selectedCategory === cat ? "filter-btn active" : "filter-btn"}
              onClick={() => {
                setSelectedCategory(cat);
                if (cat === "All") setSelectedLanguage("All");
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Language Filter (Jab koi specific category select ho, tab dikhega) */}
        {selectedCategory !== "All" && selectedCategory !== "Trending" && (
          <div style={{ marginTop: "15px", animation: "fadeIn 0.3s ease" }}>
            <h2>Filter by Language ({selectedCategory})</h2>
            <div className="filter-row">
              {languages.map((lang) => (
                <button
                  key={lang}
                  className={selectedLanguage === lang ? "filter-btn active" : "filter-btn"}
                  onClick={() => setSelectedLanguage(lang)}
                  style={{ background: selectedLanguage === lang ? "#e50914" : "#1f1f1f" }}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Content Grid (Agar searchQuery active hai ya category selected hai, toh filtered list dikhegi) */}
      {selectedCategory === "All" && searchQuery === "" ? (
        <>
          <section className="category-section">
            <div className="section-title">
              <h2>Trending Titles</h2>
              <span>{allMovies.length} titles</span>
            </div>
            <div className="movie-grid">
              {allMovies.slice(0, 6).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>

          {categories.slice(2).map((cat) => {
            const catMovies = allMovies.filter((m) => m.category === cat);
            if (catMovies.length === 0) return null;

            return (
              <section className="category-section" key={cat}>
                <div className="section-title">
                  <h2>{cat}</h2>
                  <span style={{ cursor: "pointer", color: "#e50914" }} onClick={() => setSelectedCategory(cat)}>
                    View All →
                  </span>
                </div>
                <div className="movie-grid">
                  {catMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </section>
            );
          })}
        </>
      ) : (
        <section className="category-section">
          <div className="section-title">
            <h2>{searchQuery ? `Search Results for "${searchQuery}"` : `${selectedCategory} ${selectedLanguage !== "All" ? `- ${selectedLanguage}` : ""}`}</h2>
            <span>{filteredMovies.length} titles found</span>
          </div>

          {filteredMovies.length > 0 ? (
            <div className="movie-grid">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ textAlign: "center", padding: "40px", color: "#888" }}>
              <h3>No content found matching your search.</h3>
            </div>
          )}
        </section>
      )}

    </main>
  );
}

export default Home;