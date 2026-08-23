const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema({
  epNum: Number,
  url: String
});

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  language: { type: String, default: "Hindi" },
  genre: String,
  year: Number,
  rating: { type: Number, default: 8.0 },
  duration: String,
  poster: String,
  description: String,
  videoUrl: String,
  episodes: [episodeSchema],
  availableAudio: String,
  isHeroBanner: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: true },
  isAudioSeries: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Movie", movieSchema);