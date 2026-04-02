const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: [true, "Username required."],
    unique: [true, "Username already exist."],
  },
  email: {
    type: String,
    require: [true, "email required."],
    unique: [true, "User with email already exist."],
  },
  password: {
    type: String,
    require: [true, "Password required."],
    select: false,
  },
  bio: {
    type: String,
  },
  imageUrl: {
    type: String,
    default: "https://ik.imagekit.io/spy1710/user_paceholder.png",
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
