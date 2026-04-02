const userModel = require("../models/user.model.js");
const blacklistModel = require("../models/blacklist.model.js");
const jwt = require("jsonwebtoken");
const redis = require("../config/cache.js");

async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Token not found",
    });
  }

  const isTokenBlacklisted = await redis.get(token);

  if (isTokenBlacklisted) {
    return res.status(401).json({
      success: true,
      message: "Unauthorized - Invalid Token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid token",
    });
  }
}

module.exports = authUser;
