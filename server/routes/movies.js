const router = require("express").Router();
const Movie = require("../model/Movie"); // Aapke model ka path

// 1. GET ALL MOVIES & AUDIO SERIES
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. CREATE NEW MOVIE OR AUDIO SERIES (Admin)
router.post("/create", async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    const savedMovie = await newMovie.save();
    res.status(201).json({ message: "Content published successfully! 🚀", movie: savedMovie });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. TOGGLE VISIBILITY (On/Off for Home Page)
router.patch("/:id/visibility", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Content not found!" });

    movie.isVisible = !movie.isVisible;
    await movie.save();
    res.status(200).json({ message: "Visibility updated successfully! 🔄", movie });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. ADD NEW EPISODE TO EXISTING SERIES
router.post("/:id/episode", async (req, res) => {
  try {
    const { url } = req.body;
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Series not found!" });

    const nextEpNum = (movie.episodes ? movie.episodes.length : 0) + 1;
    movie.episodes.push({ epNum: nextEpNum, url });
    
    await movie.save();
    res.status(200).json({ message: `Episode ${nextEpNum} added successfully!`, movie });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. DELETE CONTENT
router.delete("/:id", async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Content deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;