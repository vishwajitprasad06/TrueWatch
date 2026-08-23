import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { movies as staticMovies } from "../data/movies";
import { useNotification } from "../components/NotificationManager";
import AudioSeriesManager from "./AudioSeriesManager";

function Admin() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  const [activeTab, setActiveTab] = useState("movie");
  const [dbMovies, setDbMovies] = useState([]);

  // Movie Form State
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("Hindi");
  const [category, setCategory] = useState("Movies");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("2026");
  const [rating, setRating] = useState("");
  const [duration, setDuration] = useState("");
  const [poster, setPoster] = useState("");
  const [description, setDescription] = useState("");
  
  const [videoUrl, setVideoUrl] = useState("");
  const [episodesInput, setEpisodesInput] = useState(""); 
  const [selectedAudioLangs, setSelectedAudioLangs] = useState(["Hindi"]);
  const [isHeroBanner, setIsHeroBanner] = useState(false);

  // Add New Episode to Existing Series State
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [newEpUrl, setNewEpUrl] = useState("");

  // Custom Page Form State
  const [pageTitle, setPageTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [pageContent, setPageContent] = useState("");

  // Backend se movies fetch karna
  useEffect(() => {
    fetch("http://localhost:5000/api/movies")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setDbMovies(data);
        }
      })
      .catch((err) => console.log("Backend offline:", err));
  }, []);

  const localMovies = JSON.parse(localStorage.getItem("customMovies")) || [];
  const allAdminMovies = [...dbMovies, ...localMovies, ...staticMovies];

  const handleAudioCheckbox = (lang) => {
    if (selectedAudioLangs.includes(lang)) {
      setSelectedAudioLangs(selectedAudioLangs.filter((l) => l !== lang));
    } else {
      setSelectedAudioLangs([...selectedAudioLangs, lang]);
    }
  };

  // --- 1. BACKEND CONNECTED: Movie / Audio Series Submit ---
  const handleMovieSubmit = async (e) => {
    e.preventDefault();

    const formattedEpisodes = episodesInput.trim()
      ? episodesInput.split(",").map((url, index) => ({
          epNum: index + 1,
          url: url.trim(),
        }))
      : [];

    const newMovie = {
      title,
      language,
      category,
      genre,
      year: Number(year),
      rating: Number(rating),
      duration,
      poster,
      description,
      videoUrl,
      episodes: formattedEpisodes,
      availableAudio: selectedAudioLangs.join(", "),
      isHeroBanner,
      isVisible: true
    };

    try {
      const response = await fetch("http://localhost:5000/api/movies/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMovie),
      });

      if (response.ok) {
        showNotification("Content published successfully to Database! 🚀", "success");
        navigate("/");
      } else {
        showNotification("Failed to publish content.", "error");
      }
    } catch (err) {
      console.error("Server connection error:", err);
      showNotification("Backend server is offline!", "error");
    }
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    const cleanSlug = pageSlug.toLowerCase().replace(/\s+/g, "-");
    const newPage = {
      id: Date.now(),
      title: pageTitle,
      slug: cleanSlug,
      content: pageContent,
    };

    const existingPages = JSON.parse(localStorage.getItem("customPages")) || [];
    localStorage.setItem("customPages", JSON.stringify([...existingPages, newPage]));

    showNotification(`Custom Page '/page/${cleanSlug}' created successfully! ✨`, "success");
    setPageTitle("");
    setPageSlug("");
    setPageContent("");
  };

  // --- 2. BACKEND CONNECTED: Hero Banner Toggle ---
  const handleToggleBanner = async (movieId) => {
    const targetMovie = allAdminMovies.find((m) => (m._id || m.id) === movieId);
    if (!targetMovie) return;

    // Agar movie MongoDB database ki hai (_id hai)
    if (targetMovie._id) {
      try {
        const response = await fetch(`http://localhost:5000/api/movies/${targetMovie._id}/banner`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          showNotification("Banner status updated in Database! 🔥", "success");
          window.location.reload();
          return;
        }
      } catch (err) {
        console.log("Error updating banner in backend:", err);
      }
    }

    // Fallback to LocalStorage for static/local items
    let customMovies = JSON.parse(localStorage.getItem("customMovies")) || [];
    const existsInCustom = customMovies.some((m) => m.id === movieId);
    let updatedCustomMovies = [...customMovies];

    if (!existsInCustom) {
      const targetStatic = staticMovies.find((m) => m.id === movieId);
      if (targetStatic) {
        updatedCustomMovies.push({ ...targetStatic, isHeroBanner: true });
      }
    } else {
      updatedCustomMovies = updatedCustomMovies.map((m) => {
        if (m.id === movieId) {
          return { ...m, isHeroBanner: !m.isHeroBanner };
        }
        return m;
      });
    }

    localStorage.setItem("customMovies", JSON.stringify(updatedCustomMovies));
    showNotification("Banner status updated! 🔥", "success");
    window.location.reload();
  };

  // Add New Episode Handler for Existing Series
  const handleAddEpisodeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMovieId || !newEpUrl) {
      showNotification("Please select a series and provide the episode URL!", "error");
      return;
    }

    const targetMovie = allAdminMovies.find((m) => (m._id || m.id) === Number(selectedMovieId) || m._id === selectedMovieId);

    if (targetMovie && targetMovie._id) {
      try {
        const response = await fetch(`http://localhost:5000/api/movies/${targetMovie._id}/episode`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: newEpUrl.trim() }),
        });

        if (response.ok) {
          showNotification(`New episode added successfully to Database! 🎉`, "success");
          setNewEpUrl("");
          navigate("/");
          return;
        }
      } catch (err) {
        console.log("Error adding episode to backend:", err);
      }
    }

    // LocalStorage fallback
    let customMovies = JSON.parse(localStorage.getItem("customMovies")) || [];
    let localTarget = customMovies.find((m) => m.id === Number(selectedMovieId));

    if (!localTarget) {
      const staticTarget = staticMovies.find((m) => m.id === Number(selectedMovieId));
      if (staticTarget) {
        localTarget = { ...staticTarget, episodes: staticTarget.episodes || [] };
        customMovies.push(localTarget);
      }
    }

    if (localTarget) {
      const nextEpNum = (localTarget.episodes ? localTarget.episodes.length : 0) + 1;
      localTarget.episodes = [
        ...(localTarget.episodes || []),
        { epNum: nextEpNum, url: newEpUrl.trim() }
      ];

      const filteredCustom = customMovies.filter((m) => m.id !== Number(selectedMovieId));
      localStorage.setItem("customMovies", JSON.stringify([...filteredCustom, localTarget]));

      showNotification(`🎉 Episode ${nextEpNum} added successfully!`, "success");
      setNewEpUrl("");
      navigate("/");
    }
  };

  return (
    <main className="page" style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "60px" }}>
      <BackButton />

      <div className="section-title" style={{ marginTop: "20px" }}>
        <h2>TrueWatch Advanced CMS</h2>
        <span>Streaming & Page Manager Dashboard</span>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => setActiveTab("movie")}
          style={{ ...tabBtnStyle, background: activeTab === "movie" ? "#e50914" : "#1f1f1f" }}
        >
          🎬 Add Movie & Audio
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("premiumSettings")}
          style={{ ...tabBtnStyle, background: activeTab === "premiumSettings" ? "#e50914" : "#1f1f1f" }}
        >
          ⚙️ Manage Premium & Coins
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("audioSeries")}
          style={{ ...tabBtnStyle, background: activeTab === "audioSeries" ? "#e50914" : "#1f1f1f" }}
        >
          🎧 Audio Series Studio
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("editEpisodes")}
          style={{ ...tabBtnStyle, background: activeTab === "editEpisodes" ? "#e50914" : "#1f1f1f" }}
        >
          ➕ Add New Episode
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("banner")}
          style={{ ...tabBtnStyle, background: activeTab === "banner" ? "#e50914" : "#1f1f1f" }}
        >
          🖼️ Manage Hero Banner Slider
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("page")}
          style={{ ...tabBtnStyle, background: activeTab === "page" ? "#e50914" : "#1f1f1f" }}
        >
          📄 Create Custom Page
        </button>
      </div>

      {activeTab === "movie" && (
        <form onSubmit={handleMovieSubmit} style={formStyle}>
          <h3>Add Streaming Content & Audio Options (MongoDB Connected)</h3>
          
          <div style={inputGroup}>
            <label style={labelStyle}>Title</label>
            <input type="text" placeholder="e.g. Supreme Immortal Yoddha" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div style={inputGroup}>
              <label style={labelStyle}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                <option value="Movies">Movies</option>
                <option value="TV">TV Shows</option>
                <option value="Anime">Anime</option>
                <option value="Shorts">Shorts</option>
                <option value="Kids">Kids</option>
                <option value="Education">Education</option>
                <option value="Music">Music</option>
              </select>
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Primary Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} style={inputStyle}>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
              </select>
            </div>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Available Audio Languages:</label>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", background: "#111", padding: "12px", borderRadius: "8px", border: "1px solid #333" }}>
              {["Hindi", "English", "Japanese", "Telugu", "Tamil", "Korean"].map((lang) => (
                <label key={lang} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "14px", color: "#ddd" }}>
                  <input
                    type="checkbox"
                    checked={selectedAudioLangs.includes(lang)}
                    onChange={() => handleAudioCheckbox(lang)}
                    style={{ accentColor: "#e50914", width: "16px", height: "16px" }}
                  />
                  {lang}
                </label>
              ))}
            </div>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Default Video / Main Streaming URL</label>
            <input type="url" placeholder="https://example.com/video.mp4" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Episodes / Audio Parts URLs (Comma separated)</label>
            <input 
              type="text" 
              placeholder="https://server.com/ep1.mp4, https://server.com/ep2.mp4" 
              value={episodesInput} 
              onChange={(e) => setEpisodesInput(e.target.value)} 
              style={inputStyle} 
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div style={inputGroup}>
              <label style={labelStyle}>Genre</label>
              <input type="text" placeholder="Action, Fantasy, Drama" value={genre} onChange={(e) => setGenre(e.target.value)} required style={inputStyle} />
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}>Release Year</label>
              <input type="number" placeholder="2026" value={year} onChange={(e) => setYear(e.target.value)} required style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div style={inputGroup}>
              <label style={labelStyle}>Rating</label>
              <input type="number" step="0.1" placeholder="8.5" value={rating} onChange={(e) => setRating(e.target.value)} required style={inputStyle} />
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}>Duration / Episodes</label>
              <input type="text" placeholder="2h 15m or 24m" value={duration} onChange={(e) => setDuration(e.target.value)} required style={inputStyle} />
            </div>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Poster Image URL</label>
            <input type="url" placeholder="https://images.unsplash.com/..." value={poster} onChange={(e) => setPoster(e.target.value)} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Description</label>
            <textarea rows="3" placeholder="Enter full story summary or description here..." value={description} onChange={(e) => setDescription(e.target.value)} required style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#111", padding: "12px", borderRadius: "8px", border: "1px solid #333" }}>
            <input
              type="checkbox"
              id="heroCheck"
              checked={isHeroBanner}
              onChange={(e) => setIsHeroBanner(e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "#e50914" }}
            />
            <label htmlFor="heroCheck" style={{ color: "white", fontSize: "14px", cursor: "pointer" }}>
              ⭐ Add to <strong>Hero Banner Slider</strong>
            </label>
          </div>

          <button type="submit" style={submitBtnStyle}>Publish Content to Database 🚀</button>
        </form>
      )}

      {activeTab === "audioSeries" && <AudioSeriesManager />}

      {activeTab === "editEpisodes" && (
        <form onSubmit={handleAddEpisodeSubmit} style={formStyle}>
          <h3>Add New Episode to Existing Series</h3>
          <p style={{ color: "#aaa", fontSize: "13px", marginTop: "-10px" }}>
            Select any series or audio story to add a new episode to its sequence.
          </p>

          <div style={inputGroup}>
            <label style={labelStyle}>Select Series / Show</label>
            <select 
              value={selectedMovieId} 
              onChange={(e) => setSelectedMovieId(e.target.value)} 
              style={inputStyle}
              required
            >
              <option value="">-- Choose Series or Audio Story --</option>
              {allAdminMovies.map((m) => (
                <option key={m._id || m.id} value={m._id || m.id}>
                  {m.title} ({m.category})
                </option>
              ))}
            </select>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>New Episode Video/Audio URL</label>
            <input 
              type="url" 
              placeholder="https://server.com/new-episode.mp4" 
              value={newEpUrl} 
              onChange={(e) => setNewEpUrl(e.target.value)} 
              style={inputStyle} 
              required
            />
          </div>

          <button type="submit" style={submitBtnStyle}>Publish New Episode 🚀</button>
        </form>
      )}

      {activeTab === "banner" && (
        <div style={formStyle}>
          <h3>Select Multiple Movies for Hero Slider (Max 10)</h3>
          <p style={{ color: "#aaa", fontSize: "13px", marginTop: "-10px" }}>
            Enable multiple movies to include them in the Home page auto-slider.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "450px", overflowY: "auto" }}>
            {allAdminMovies.map((movie) => {
              const isSelected = movie.isHeroBanner;
              const movieId = movie._id || movie.id;
              return (
                <div key={movieId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#111", padding: "10px", borderRadius: "8px", border: "1px solid #333" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <img src={movie.poster} alt={movie.title} style={{ width: "40px", height: "55px", objectFit: "cover", borderRadius: "4px" }} />
                    <div>
                      <strong style={{ color: "white", fontSize: "14px" }}>{movie.title}</strong>
                      <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{movie.category} • {movie.language}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleBanner(movieId)}
                    style={{
                      background: isSelected ? "#22c55e" : "#1f1f1f",
                      color: "white",
                      border: isSelected ? "none" : "1px solid #444",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "bold"
                    }}
                  >
                    {isSelected ? "In Slider ✓" : "Add to Slider"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "page" && (
        <form onSubmit={handlePageSubmit} style={formStyle}>
          <h3>Create a New Website Page</h3>
          <div style={inputGroup}>
            <label style={labelStyle}>Page Title</label>
            <input type="text" placeholder="e.g. Privacy Policy" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} required style={inputStyle} />
          </div>
          <div style={inputGroup}>
            <label style={labelStyle}>Page URL Slug</label>
            <input type="text" placeholder="privacy-policy" value={pageSlug} onChange={(e) => setPageSlug(e.target.value)} required style={inputStyle} />
          </div>
          <div style={inputGroup}>
            <label style={labelStyle}>Page Content</label>
            <textarea rows="6" placeholder="Enter page text/HTML here..." value={pageContent} onChange={(e) => setPageContent(e.target.value)} required style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <button type="submit" style={submitBtnStyle}>Create & Publish Page</button>
        </form>
      )}

      {activeTab === "premiumSettings" && (
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const premPrice = e.target.premPrice.value;
            const cashPrice = e.target.cashPrice.value;
            const dailyCoins = e.target.dailyCoins.value;
            const adCoins = e.target.adCoins.value;

            localStorage.setItem("admin_prem_price", premPrice);
            localStorage.setItem("admin_cash_price", cashPrice);
            localStorage.setItem("admin_daily_coins", dailyCoins);
            localStorage.setItem("admin_ad_coins", adCoins);

            showNotification("⚙️ Premium & Coin Settings Updated Successfully! 🚀", "success");
          }} 
          style={formStyle}
        >
          <h3>⚙️ Manage Premium Pricing & Coin Rewards</h3>
          <p style={{ color: "#aaa", fontSize: "13px", marginTop: " -10px" }}>
            Aap yahan se premium coins price, cash price, aur daily/ad bonus coins ko adjust kar sakte hain.
          </p>

          <div style={inputGroup}>
            <label style={labelStyle}>Premium Price in Coins</label>
            <input 
              type="number" 
              name="premPrice" 
              defaultValue={localStorage.getItem("admin_prem_price") || 50} 
              style={inputStyle} 
              required 
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Premium Cash Price (₹)</label>
            <input 
              type="number" 
              name="cashPrice" 
              defaultValue={localStorage.getItem("admin_cash_price") || 199} 
              style={inputStyle} 
              required 
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Daily Sign-in Bonus Coins</label>
            <input 
              type="number" 
              name="dailyCoins" 
              defaultValue={localStorage.getItem("admin_daily_coins") || 1} 
              style={inputStyle} 
              required 
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Watch Ad Bonus Coins</label>
            <input 
              type="number" 
              name="adCoins" 
              defaultValue={localStorage.getItem("admin_ad_coins") || 5} 
              style={inputStyle} 
              required 
            />
          </div>

          <button type="submit" style={submitBtnStyle}>Save Settings & Update 🚀</button>
        </form>
      )}
      
    </main>
  );
}

const tabBtnStyle = { padding: "10px 16px", borderRadius: "8px", color: "white", fontWeight: "bold", border: "none", cursor: "pointer", fontSize: "13px" };
const formStyle = { display: "flex", flexDirection: "column", gap: "20px", background: "#171717", padding: "30px", borderRadius: "12px", border: "1px solid #292929" };
const inputGroup = { display: "flex", flexDirection: "column", gap: "8px" };
const labelStyle = { fontSize: "14px", color: "#aaa" };
const inputStyle = { background: "#111", border: "1px solid #333", borderRadius: "8px", padding: "12px", color: "white", fontSize: "15px", outline: "none" };
const submitBtnStyle = { background: "#e50914", color: "white", padding: "14px", borderRadius: "8px", fontWeight: "bold", border: "none", fontSize: "16px", marginTop: "10px", cursor: "pointer" };

export default Admin;