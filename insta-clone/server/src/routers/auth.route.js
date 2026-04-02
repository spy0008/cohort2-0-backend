const express = require("express");
const { registerUser, loginUser, getMe } = require("../controllers/auth.controller");
const authCheckUser = require("../middlewares/auth.middleware.js");
const authRouter = express.Router();

/**
 * @description user register route
 * @route /api/auth/register
 */
authRouter.post("/register", registerUser);

/**
 * @description user login route
 * @route /api/auth/login
 */
authRouter.post("/login", loginUser);

/**
 * @description get a user
 * @route /api/auth/get-me
 */
authRouter.post("/get-me", authCheckUser, getMe);
module.exports = authRouter;
