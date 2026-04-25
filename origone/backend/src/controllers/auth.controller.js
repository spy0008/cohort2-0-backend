import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import {
  createContact,
  createFundAccount,
} from "../services/payment.service.js";

async function sendTokenResponse(user, res, message) {
  const token = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message,
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
}

export const register = async (req, res) => {
  const { email, contact, password, fullname, isSeller } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or contact already exists" });
    }

    const isSellerBoolean = isSeller === true || isSeller === "true";

    const user = await userModel.create({
      email,
      contact,
      password,
      fullname,
      role: isSellerBoolean ? "seller" : "buyer",
    });

    await sendTokenResponse(user, res, "User registered successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  await sendTokenResponse(user, res, "User logged in successfully");
};

export const getMe = async (req, res) => {
  const userId = req.user._id;

  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found!!!",
    });
  }

  res.status(200).json({
    success: true,
    message: "User found successfully!!!",
    user,
  });
};

export const googleCallback = async (req, res) => {
  const { id, displayName, emails, photos } = req.user;
  const email = emails[0].value;
  const profilePic = photos[0].value;

  let user = await userModel.findOne({
    email,
  });

  if (!user) {
    user = await userModel.create({
      email,
      googleId: id,
      fullname: displayName,
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token);

  res.redirect("http://localhost:5173/");
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Logout failed",
    });
  }
};

export const updateBankDetails = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { accountNumber, ifsc, accountHolderName } = req.body;

    if (!accountNumber || !ifsc || !accountHolderName) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await userModel.findById(sellerId);

    // 🔥 1. Create Contact (KYC)
    const contact = await createContact(user);

    // 🔥 2. Create Fund Account
    const fundAccount = await createFundAccount(contact.id, {
      accountNumber,
      ifsc,
      accountHolderName,
    });

    // 🔥 3. Save everything
    user.bankDetails = {
      accountNumber,
      ifsc,
      accountHolderName,
      isVerified: true,
      razorpayContactId: contact.id,
      razorpayFundAccountId: fundAccount.id,
    };

    await user.save();

    res.json({
      success: true,
      message: "Bank linked successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
