const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth"); 
const movieRoutes = require("./routes/movies"); 
const reviewRoutes = require("./routes/reviews");
const Movie = require("./model/Movie");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// --- MULTI-API STARTUP SYNC FUNCTION ---
const syncAllApisOnStartup = async () => {
  console.log("Starting multi-API background sync... 🔄");

  // 1. Kitsu API Sync (Anime)
  try {
    const kitsuRes = await fetch('https://kitsu.io/api/edge/anime?page[limit]=15');
    if (kitsuRes.ok) {
      const kitsuData = await kitsuRes.json();
      if (kitsuData && kitsuData.data) {
        for (let anime of kitsuData.data) {
          const attr = anime.attributes;
          const animeContent = {
            title: attr.canonicalTitle || attr.titles?.en || "Unknown Anime",
            category: "Anime",
            language: "Japanese",
            genre: "Action, Fantasy, Anime",
            year: attr.startDate ? new Date(attr.startDate).getFullYear() : 2026,
            rating: attr.averageRating ? (Number(attr.averageRating) / 10).toFixed(1) : 8.0,
            duration: attr.episodeLength ? `${attr.episodeLength}m` : "24m",
            poster: attr.posterImage?.large || attr.posterImage?.original || "",
            description: attr.synopsis || "No description available.",
            videoUrl: attr.youtubeVideoId ? `https://www.youtube.com/watch?v=${attr.youtubeVideoId}` : "https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1192-large.mp4",
            isVisible: true,
            isHeroBanner: false
          };
          await Movie.findOneAndUpdate({ title: animeContent.title }, animeContent, { upsert: true, new: true });
        }
        console.log("Kitsu Anime synced successfully! 🎌");
      }
    }
  } catch (err) {
    console.log("Kitsu sync skipped:", err.message);
  }

  // 2. Jikan API Sync (Anime - MyAnimeList)
  try {
    const jikanRes = await fetch('https://api.jikan.moe/v4/top/anime');
    if (jikanRes.ok) {
      const jikanData = await jikanRes.json();
      if (jikanData && jikanData.data) {
        for (let anime of jikanData.data) {
          const animeContent = {
            title: anime.title,
            category: "Anime",
            language: "Japanese",
            genre: anime.genres ? anime.genres.map(g => g.name).join(", ") : "Action, Anime",
            year: anime.year || 2026,
            rating: anime.score || 8.0,
            duration: anime.duration || "24m",
            poster: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
            description: anime.synopsis || "No description available.",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1192-large.mp4",
            isVisible: true,
            isHeroBanner: false
          };
          await Movie.findOneAndUpdate({ title: anime.title }, animeContent, { upsert: true, new: true });
        }
        console.log("Jikan Anime synced successfully! ⭐");
      }
    }
  } catch (err) {
    console.log("Jikan sync skipped due to timeout/rate limit:", err.message);
  }

  // 3. TMDB API Sync (Movies & TV Shows)
  try {
    const TMDB_API_KEY = process.env.TMDB_API_KEY || "";
    if (TMDB_API_KEY) {
      const tmdbRes = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}`);
      if (tmdbRes.ok) {
        const tmdbData = await tmdbRes.json();
        if (tmdbData && tmdbData.results) {
          for (let item of tmdbData.results) {
            const movieContent = {
              title: item.title || item.name || "Unknown Title",
              category: item.media_type === "tv" ? "TV" : "Movies",
              language: item.original_language ? item.original_language.toUpperCase() : "English",
              genre: "Action, Drama, Thriller",
              year: item.release_date ? new Date(item.release_date).getFullYear() : (item.first_air_date ? new Date(item.first_air_date).getFullYear() : 2026),
              rating: item.vote_average ? item.vote_average.toFixed(1) : 8.0,
              duration: "120m",
              poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
              description: item.overview || "No description available.",
              videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1192-large.mp4",
              isVisible: true,
              isHeroBanner: false
            };
            await Movie.findOneAndUpdate({ title: movieContent.title }, movieContent, { upsert: true, new: true });
          }
          console.log("TMDB Movies & TV Shows synced successfully! 🎬");
        }
      }
    } else {
      console.log("TMDB_API_KEY not found in environment variables, skipping TMDB sync.");
    }
  } catch (err) {
    console.log("TMDB sync skipped:", err.message);
  }

  console.log("All available API startup sync processes finished! 🚀");
};

// Database Connection & Startup Trigger
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully to TrueWatch Database 🚀");
    syncAllApisOnStartup(); 
  })
  .catch((err) => console.log("Database connection error: ", err));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("TrueWatch Multi-API Backend Server is active and running...");
});

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});