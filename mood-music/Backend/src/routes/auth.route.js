const { Router } = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  logoutUser
} = require("../controllers/auth.controller.js");
const authUser = require("../middleware/auth.middleware.js");

const userRouter = Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.get("/get-me", authUser, getMe);

userRouter.get("/logout", authUser, logoutUser);

module.exports = userRouter;
