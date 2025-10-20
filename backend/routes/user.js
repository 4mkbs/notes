const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const { authenticateToken } = require("../utilities");

// Health check
router.get("/", (req, res) => {
  res.json({ data: "Hello World!" });
});

// Register
router.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "All fields required" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: true, message: "Password must be at least 6 characters" });
  }
  try {
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res
        .status(400)
        .json({ error: true, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });
    return res.json({
      error: false,
      user: {
        fullName: user.fullName,
        email: user.email,
        _id: user._id,
        createdOn: user.createdOn,
      },
      accessToken,
      message: "Account created successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Email and password required" });
  }
  try {
    const userInfo = await User.findOne({ email });
    if (!userInfo) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, userInfo.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid credentials" });
    }
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });
    return res.json({
      error: false,
      message: "Login successful",
      user: {
        fullName: userInfo.fullName,
        email: userInfo.email,
        _id: userInfo._id,
        createdOn: userInfo.createdOn,
      },
      accessToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

// Get user
router.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });
  if (!isUser) {
    return res.sendStatus(401);
  }
  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: "User found",
  });
});

module.exports = router;
