import { useState, useEffect } from "react";
import { useNotification } from "../components/NotificationManager";
import { Eye, EyeOff, Plus, Trash2, Edit3 } from "lucide-react";

function AudioSeriesManager() {
  const { showNotification } = useNotification();
  const [seriesList, setSeriesList] = useState([]);
  
  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Audio Stories");
  const [language, setLanguage] = useState("Hindi");
  const [genre, setGenre] = useState("");
  const [poster, setPoster] = useState("");
  const [description, setDescription] = useState("");
  const [episodesInput, setEpisodesInput] = useState("");
  const [isVisible, setIsVisible] = useState(true); // Visible On/Off toggle

  // LocalStorage se series load karna
  useEffect(() => {
    const savedSeries = JSON.parse(localStorage.getItem("customAudioSeries")) || [];
    setSeriesList(savedSeries);
  }, []);

  const handleCreateSeries = (e) => {
    e.preventDefault();

    const formattedEpisodes = episodesInput.trim()
      ? episodesInput.split(",").map((url, index) => ({
          epNum: index + 1,
          url: url.trim(),
        }))
      : [];

    const newSeries = {
      id: Date.now(),
      title,
      category,
      language,
      genre,
      year: 2026,
      rating: 9.0,
      poster,
      description,
      episodes: formattedEpisodes,
      videoUrl: formattedEpisodes[0]?.url || "", // Main streaming link pehla episode hoga
      isVisible: isVisible, // Home page par dikhega ya nahi
      isAudioSeries: true
    };

    const updatedList = [newSeries, ...seriesList];
    setSeriesList(updatedList);
    
    // Custom audio series alag store hogi aur customMovies mein bhi daal denge taaki home/search pe dikhe
    localStorage.setItem("customAudioSeries", JSON.stringify(updatedList));

    let allCustomMovies = JSON.parse(localStorage.getItem("customMovies")) || [];
    localStorage.setItem("customMovies", JSON.stringify([newSeries, ...allCustomMovies]));

    showNotification("Audio series published successfully! 🎧", "success");
    
    // Reset Form
    setTitle("");
    setDescription("");
    setPoster("");
    setEpisodesInput("");
    setGenre("");
  };

  // Toggle Visibility (On / Off)
  const handleToggleVisibility = (id) => {
    const updated = seriesList.map((item) => {
      if (item.id === id) {
        return { ...item, isVisible: !item.isVisible };
      }
      return item;
    });

    setSeriesList(updated);
    localStorage.setItem("customAudioSeries", JSON.stringify(updated));
    localStorage.setItem("customMovies", JSON.stringify(updated));
    showNotification("Series visibility updated! 🔄", "success");
  };

  // Delete Series
  const handleDelete = (id) => {
    const filtered = seriesList.filter((item) => item.id !== id);
    setSeriesList(filtered);
    localStorage.setItem("customAudioSeries", JSON.stringify(filtered));
    localStorage.setItem("customMovies", JSON.stringify(filtered));
    showNotification("Series deleted successfully!", "success");
  };

  return (
    <div style={{ padding: "20px 0" }}>
      <h2>🎧 Audio Series Studio Manager</h2>
      <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "25px" }}>
        Create and manage your Hindi audio stories and series. Control visibility on the home page instantly.
      </p>

      {/* Create / Add Form */}
      <form onSubmit={handleCreateSeries} style={formStyle}>
        <h3>Create New Audio Series</h3>

        <div style={inputGroup}>
          <label style={labelStyle}>Series Title</label>
          <input type="text" placeholder="e.g. Supreme Immortal Yoddha - Season 1" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <div style={inputGroup}>
            <label style={labelStyle}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
              <option value="Audio Stories">Audio Stories</option>
              <option value="Anime">Anime</option>
              <option value="Education">Education</option>
              <option value="Music">Music</option>
              <option value="Trending">Trending</option>
            </select>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} style={inputStyle}>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="Japanese">Japanese</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <div style={inputGroup}>
            <label style={labelStyle}>Genre</label>
            <input type="text" placeholder="Action, Cultivation, Fantasy" value={genre} onChange={(e) => setGenre(e.target.value)} required style={inputStyle} />
          </div>
          <div style={inputGroup}>
            <label style={labelStyle}>Poster Image URL</label>
            <input type="url" placeholder="https://images.unsplash.com/..." value={poster} onChange={(e) => setPoster(e.target.value)} required style={inputStyle} />
          </div>
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>Episodes / Audio Parts URLs (Comma separated)</label>
          <input 
            type="text" 
            placeholder="https://server.com/ep1.mp3, https://server.com/ep2.mp3" 
            value={episodesInput} 
            onChange={(e) => setEpisodesInput(e.target.value)} 
            required 
            style={inputStyle} 
          />
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>Story / Summary Description</label>
          <textarea rows="3" placeholder="Enter full story details..." value={description} onChange={(e) => setDescription(e.target.value)} required style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        {/* Visible On / Off Toggle Switch */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#111", padding: "12px 15px", borderRadius: "8px", border: "1px solid #333" }}>
          <div>
            <strong style={{ color: "white", fontSize: "14px", display: "block" }}>Home Page Visibility</strong>
            <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>Turn ON to display on Home & Search. Turn OFF to hide.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            style={{
              background: isVisible ? "#22c55e" : "#333",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "20px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "13px"
            }}
          >
            {isVisible ? "Visible: ON ✓" : "Visible: OFF ✕"}
          </button>
        </div>

        <button type="submit" style={submitBtnStyle}>Publish Audio Series 🚀</button>
      </form>

      {/* Existing Series Management List */}
      <h3 style={{ marginTop: "40px", marginBottom: "15px" }}>Manage Created Audio Series</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {seriesList.length > 0 ? (
          seriesList.map((series) => (
            <div key={series.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#171717", padding: "12px 15px", borderRadius: "10px", border: "1px solid #292929" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <img src={series.poster} alt={series.title} style={{ width: "45px", height: "60px", objectFit: "cover", borderRadius: "6px" }} />
                <div>
                  <strong style={{ color: "white", fontSize: "15px", display: "block" }}>{series.title}</strong>
                  <span style={{ color: "#888", fontSize: "12px" }}>{series.category} • {series.episodes?.length || 0} Episodes</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => handleToggleVisibility(series.id)}
                  style={{
                    background: series.isVisible ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
                    color: series.isVisible ? "#22c55e" : "#ef4444",
                    border: `1px solid ${series.isVisible ? "#22c55e" : "#ef4444"}`,
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}
                >
                  {series.isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
                  {series.isVisible ? "Visible ON" : "Visible OFF"}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(series.id)}
                  style={{ background: "#2a1215", color: "#e50914", border: "1px solid #e50914", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#777", fontStyle: "italic" }}>No custom audio series created yet.</p>
        )}
      </div>
    </div>
  );
}

const formStyle = { display: "flex", flexDirection: "column", gap: "20px", background: "#171717", padding: "30px", borderRadius: "12px", border: "1px solid #292929" };
const inputGroup = { display: "flex", flexDirection: "column", gap: "8px" };
const labelStyle = { fontSize: "14px", color: "#aaa" };
const inputStyle = { background: "#111", border: "1px solid #333", borderRadius: "8px", padding: "12px", color: "white", fontSize: "15px", outline: "none" };
const submitBtnStyle = { background: "#e50914", color: "white", padding: "14px", borderRadius: "8px", fontWeight: "bold", border: "none", fontSize: "16px", marginTop: "10px", cursor: "pointer" };

export default AudioSeriesManager;