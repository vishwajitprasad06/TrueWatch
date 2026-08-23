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

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully to TrueWatch Database 🚀"))
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