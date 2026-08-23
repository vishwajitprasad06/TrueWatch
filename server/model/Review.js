const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
  date: { type: String, required: true }
});

module.exports = mongoose.model("Review", reviewSchema);