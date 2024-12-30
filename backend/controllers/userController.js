import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/authUtils.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
};

export const refreshToken = (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken)
    return res.status(403).json({ error: "Refresh token required" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid refresh token" });
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  });
};

export const getUserDetails = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password"); // Exclude password from response
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user details" });
    }
  };
  