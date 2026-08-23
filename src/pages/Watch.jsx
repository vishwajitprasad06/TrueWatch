import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import { movies as staticMovies } from "../data/movies";
import PlaybackSpeedControl from "../components/PlaybackSpeedControl"; // 1. Speed Controller Import kiya

function Watch() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const videoRef = useRef(null);
  
  const paramAudio = searchParams.get("audio");
  const paramEp = searchParams.get("ep");

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentEpIndex, setCurrentEpIndex] = useState(paramEp ? Number(paramEp) : 0);
  const [selectedQuality, setSelectedQuality] = useState("1080p");
  const [selectedAudio, setSelectedAudio] = useState(paramAudio || "Hindi");
  const [selectedSub, setSelectedSub] = useState("Off");

  // 2. Backend Database se movie / audio series fetch karna
  useEffect(() => {
    const fetchWatchMovie = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/movies");
        const dbMovies = await res.json();

        const localMovies = JSON.parse(localStorage.getItem("customMovies")) || [];
        const allMovies = [...(Array.isArray(dbMovies) ? dbMovies : []), ...localMovies, ...staticMovies];

        // MongoDB _id ya static id match karna
        const found = allMovies.find(
          (item) => String(item._id) === String(id) || Number(item.id) === Number(id)
        );

        if (found) {
          setMovie(found);
          if (found.language && !paramAudio) {
            setSelectedAudio(found.language);
          }
        }
      } catch (err) {
        console.log("Backend offline, checking local & static:", err);
        const localMovies = JSON.parse(localStorage.getItem("customMovies")) || [];
        const allMovies = [...localMovies, ...staticMovies];
        const found = allMovies.find((item) => Number(item.id) === Number(id) || String(item._id) === String(id));
        if (found) setMovie(found);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchMovie();
  }, [id, paramAudio]);

  // Watch History & Continue Watching Progress Logic
  useEffect(() => {
    if (id) {
      let history = JSON.parse(localStorage.getItem("watchHistory")) || [];
      history = [id, ...history.filter((item) => item !== id)];
      if (history.length > 20) history.pop();
      localStorage.setItem("watchHistory", JSON.stringify(history));
    }
  }, [id]);

  // Saved Time Load karein
  const handleLoadedMetadata = () => {
    const savedTime = localStorage.getItem(`progress_${id}_ep_${currentEpIndex}`);
    if (savedTime && videoRef.current) {
      videoRef.current.currentTime = Number(savedTime);
    }
  };

  // Video time update par progress save karein
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      localStorage.setItem(`progress_${id}_ep_${currentEpIndex}`, videoRef.current.currentTime);
    }
  };

  if (loading) {
    return <div className="page" style={{ textAlign: "center", padding: "100px", color: "#888" }}><h2>Loading player...</h2></div>;
  }

  if (!movie) return <div className="page"><BackButton /><h2>Video not found</h2></div>;

  // Agar movie ke paas episodes array hai toh woh play hoga, warna main videoUrl
  const activeVideoUrl = movie.episodes && movie.episodes.length > 0 
    ? movie.episodes[currentEpIndex]?.url 
    : movie.videoUrl;

  return (
    <main className="watch-page" style={{ background: "black", minHeight: "100vh" }}>
      <BackButton />

      {/* Video Player Container */}
      <div className="video-container">
        {activeVideoUrl ? (
          <video 
            ref={videoRef}
            key={activeVideoUrl} 
            src={activeVideoUrl} 
            controls 
            autoPlay 
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          >
            <track kind="subtitles" src="" srclang="hi" label="Hindi" />
          </video>
        ) : (
          <div className="video-placeholder" style={{ color: "white", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", color: "#e50914" }}>▶️ Streaming Simulation</div>
            <p>Now Playing: <strong>{movie.title}</strong></p>
            <p style={{ color: "#aaa", fontSize: "14px" }}>Quality: {selectedQuality} | Audio: {selectedAudio}</p>
          </div>
        )}
      </div>

      {/* Episodes Selector Bar (Agar episodes available hain) */}
      {movie.episodes && movie.episodes.length > 0 && (
        <div style={{ background: "#151515", padding: "15px 5%", borderBottom: "1px solid #222", display: "flex", alignItems: "center", gap: "15px", overflowX: "auto" }}>
          <span style={{ color: "#aaa", fontSize: "14px", fontWeight: "bold", whiteSpace: "nowrap" }}>Episodes:</span>
          <div style={{ display: "flex", gap: "10px" }}>
            {movie.episodes.map((ep, index) => (
              <button
                key={index}
                onClick={() => setCurrentEpIndex(index)}
                style={{
                  background: currentEpIndex === index ? "#e50914" : "#222",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "13px",
                  whiteSpace: "nowrap"
                }}
              >
                Episode {ep.epNum}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Audio, Resolution, Subtitles & Playback Speed Controls */}
      <div className="player-controls" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 5%", background: "#111", flexWrap: "wrap", gap: "15px" }}>
        
        <div>
          <h3 style={{ color: "white", fontSize: "18px", margin: 0 }}>
            {movie.title} {movie.episodes && movie.episodes.length > 0 && `- Ep ${movie.episodes[currentEpIndex]?.epNum || currentEpIndex + 1}`}
          </h3>
          <p style={{ color: "#888", fontSize: "13px", margin: "4px 0 0 0" }}>{movie.genre} • {movie.year} • Audio: {selectedAudio}</p>
        </div>

        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center" }}>
          
          {/* Playback Speed Controller Component Integration */}
          <div>
            <label style={{ color: "#aaa", fontSize: "12px", display: "block", marginBottom: "4px" }}>Speed</label>
            <PlaybackSpeedControl videoRef={videoRef} />
          </div>

          {/* Resolution Selector */}
          <div>
            <label style={{ color: "#aaa", fontSize: "12px", display: "block", marginBottom: "4px" }}>Quality</label>
            <select value={selectedQuality} onChange={(e) => setSelectedQuality(e.target.value)} style={selectStyle}>
              <option value="1080p">1080p Full HD</option>
              <option value="720p">720p HD</option>
              <option value="480p">480p SD</option>
            </select>
          </div>

          {/* Audio Language Selector */}
          <div>
            <label style={{ color: "#aaa", fontSize: "12px", display: "block", marginBottom: "4px" }}>Audio Language</label>
            <select value={selectedAudio} onChange={(e) => setSelectedAudio(e.target.value)} style={selectStyle}>
              <option value="Hindi">Hindi (Original)</option>
              <option value="English">English</option>
              <option value="Japanese">Japanese</option>
              <option value="Telugu">Telugu</option>
              <option value="Tamil">Tamil</option>
              <option value="Korean">Korean</option>
            </select>
          </div>

          {/* Subtitles Selector */}
          <div>
            <label style={{ color: "#aaa", fontSize: "12px", display: "block", marginBottom: "4px" }}>Subtitles</label>
            <select value={selectedSub} onChange={(e) => setSelectedSub(e.target.value)} style={selectStyle}>
              <option value="Off">Off</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
            </select>
          </div>

        </div>

      </div>
    </main>
  );
}

const selectStyle = {
  background: "#1f1f1f",
  color: "white",
  border: "1px solid #333",
  padding: "8px 12px",
  borderRadius: "6px",
  fontSize: "14px",
  outline: "none",
};

export default Watch;