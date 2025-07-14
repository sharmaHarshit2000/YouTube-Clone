import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadUserProfileToCloudinary } from "../config/cloudinary.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const profile = req.file;

    // Check if a user with the given email already exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already in use" });

    // Hash password before saving to DB
    const hashedPassword = await bcrypt.hash(password, 10);

    let uploadedProfileImage;
    if (profile) {
      // Upload profile picture buffer to Cloudinary and get URL
      uploadedProfileImage = await uploadUserProfileToCloudinary(
        profile.buffer
      );
    }

    // Create new user with hashed password and profilePic URL if uploaded
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePic: uploadedProfileImage?.secure_url || "",
    });

    // Generate JWT token with 1-day expiry
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Populate channels field for returning complete user info
    await user.populate("channels");

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        channels: user.channels,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email and populate linked channels
    const user = await User.findOne({ email }).populate("channels");

    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify entered password matches stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token for session
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        channels: user.channels,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Retrieve logged-in user details (excluding password)
export const getMe = async (req, res) => {
  try {
    // req.user._id comes from authentication middleware
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("channels");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
