const express = require("express");
const bcrypt = require("bcrypt"); // Import bcrypt for hashing and comparing passwords
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const path = require('path');
const router = express.Router();

router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/signup.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/login.html'));
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '3d' });

    res.status(201).json({ message: "User created successfully", token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
router.post('/signout', async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.userId

    const result = await User.findByIdAndDelete(id)

    res.json({ message: "Signed out successfully" ,result});
  } catch (error) {
    console.error(error); // Log the actual error, not 'err'
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
