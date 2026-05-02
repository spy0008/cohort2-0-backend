import { Router } from "express";
import {
  validateRegisterUser,
  validateLoginUser,
} from "../validator/auth.validator.js";
import {
  getMe,
  googleCallback,
  login,
  logout,
  register,
  updateBankDetails,
} from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";
import { authenticateSeller, authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validateRegisterUser, register);

router.post("/login", validateLoginUser, login);

router.get("/me", authenticateUser, getMe);

router.post("/logout", logout);

router.post("/bank-details", authenticateSeller, updateBankDetails);

export default router;
