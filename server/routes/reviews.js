const router = require("express").Router();
const Review = require("../model/Review"); // Agar model banaya hai, warna niche dekhein

// 1. GET ALL REVIEWS FOR A SPECIFIC MOVIE / SERIES
router.get("/:movieId", async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId }).sort({ _id: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. POST A NEW REVIEW / COMMENT
router.post("/add", async (req, res) => {
  try {
    const { movieId, userName, rating, text, date } = req.body;

    const newReview = new Review({
      movieId,
      userName,
      rating,
      text,
      date: date || new Date().toLocaleDateString()
    });

    const savedReview = await newReview.save();
    res.status(201).json({ message: "Comment posted successfully! 💬", review: savedReview });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;