const userModel = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../config/cache.js");

async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const isAlreadyRegistered = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (isAlreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: "User with the same email or username already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      },
    );

    res.cookie("token", token);

    return res.status(201).json({
      success: true,
      message: "User registered successfully!!!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password, username } = req.body;

    const user = await userModel
      .findOne({
        $or: [{ email }, { username }],
      })
      .select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      },
    );

    res.cookie("token", token);

    return res.status(200).json({
      success: true,
      message: "User Logged in successfully!!!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
}

async function getMe(req, res) {
  try {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
      success: true,
      message: "User Fetched successfully!!!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Get Me error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
}

async function logoutUser(req, res) {
  try {
    const token = req.cookies.token;
    res.clearCookie("token");

    await redis.set(token, Date.now().toString(), "EX", 60 * 60);

    res.status(201).json({
      success: true,
      message: "logout successfully!!!",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
}

module.exports = { registerUser, loginUser, getMe, logoutUser };
