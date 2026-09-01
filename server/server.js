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

// Kitsu API se automatically anime fetch karke database mein save karne ka function
const syncAnimeOnStartup = async () => {
  try {
    // Kitsu API ka free trending anime endpoint
    const response = await fetch('https://kitsu.io/api/edge/anime?page[limit]=20&page[offset]=0');
    
    if (!response.ok) {
      console.log("Kitsu API temporarily unavailable, skipping startup sync.");
      return;
    }

    const data = await response.json();
    const animeList = data.data;

    if (animeList && animeList.length > 0) {
      for (let anime of animeList) {
        const attributes = anime.attributes;
        
        const animeContent = {
          title: attributes.canonicalTitle || attributes.titles.en || "Unknown Title",
          category: "Anime",
          language: "Japanese",
          genre: "Action, Fantasy, Anime", // Kitsu genres alag format mein hote hain, isliye default general genre de sakte hain
          year: attributes.startDate ? new Date(attributes.startDate).getFullYear() : 2026,
          rating: attributes.averageRating ? (Number(attributes.averageRating) / 10).toFixed(1) : 8.0,
          duration: attributes.episodeLength ? `${attributes.episodeLength}m` : "24m",
          poster: attributes.posterImage?.large || attributes.posterImage?.original || "",
          description: attributes.synopsis || "No description available.",
          videoUrl: attributes.youtubeVideoId 
            ? `https://www.youtube.com/watch?v=${attributes.youtubeVideoId}` 
            : "https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1192-large.mp4",
          isVisible: true,
          isHeroBanner: false
        };

        // MongoDB mein save ya update karega
        await Movie.findOneAndUpdate(
          { title: animeContent.title }, 
          animeContent, 
          { upsert: true, new: true }
        );
      }
      console.log("Kitsu Anime data automatically synced on startup! 🎌🚀");
    }
  } catch (err) {
    console.log("Skipping Kitsu anime startup sync due to error:", err.message);
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