const dns = require("dns");

// DNS servers set kar rahe hain taaki MongoDB Atlas connection error solve ho jaye
dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth"); 
const movieRoutes = require("./routes/movies"); 
const reviewRoutes = require("./routes/reviews");
const Movie = require("./models/Movie"); // Movie model import kiya hai taaki database mein save ho sake

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Jikan API se automatically data fetch karke database mein save karne ka startup function
const syncAnimeOnStartup = async () => {
  try {
    const response = await fetch('https://api.jikan.moe/v4/top/anime');
    const data = await response.json();
    const animeList = data.data;

    if (animeList && animeList.length > 0) {
      for (let anime of animeList) {
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

        // Agar anime pehle se database mein hai toh update hoga, warna naya save ho jayega
        await Movie.findOneAndUpdate(
          { title: anime.title }, 
          animeContent, 
          { upsert: true, new: true }
        );
      }
      console.log("Anime data automatically synced on startup! 🎌🚀");
    }
  } catch (err) {
    console.error("Startup anime sync error:", err);
  }
};

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully to TrueWatch Database 🚀");
    // Server start hote hi background mein automatic anime sync chal jayega
    syncAnimeOnStartup();
  })
  .catch((err) => console.log("Database connection error: ", err));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("TrueWatch Backend Server is active and running...");
});

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});