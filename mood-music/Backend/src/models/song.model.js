const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  posterUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
  },
  album: {
    type: String,
  },
  year: {
    type: String,
  },
  publisher: {
    type: String,
  },
  mood: {
    type: String,
    enum: {
      values: ["sad", "happy", "surprised"],
      message: "Enum this is",
    },
  },
});

const songModel = mongoose.model("songs", songSchema);

module.exports = songModel;
