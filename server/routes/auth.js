const router = require("express").Router();
const User = require("../model/User"); // Agar user model alag hai, ya fir niche User schema bana sakte hain
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create New User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ 
      message: "User registered successfully!", 
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    // Create JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
      message: "Login successful!"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;