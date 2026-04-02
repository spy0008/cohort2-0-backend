const songModel = require("../models/song.model.js");
const uploadFile = require("../services/storage.service.js");
const id3 = require("node-id3");

async function uploadSong(req, res) {
  const songBuffer = req.file.buffer;
  const tags = id3.read(songBuffer);
  const { mood } = req.body;

  const [songFile, posterFile] = await Promise.all([
    uploadFile({
      buffer: songBuffer,
      filename: tags.title + ".mp3",
      folder: "/mood-music/songs",
    }),
    uploadFile({
      buffer: tags.image.imageBuffer,
      filename: tags.title + ".jpeg",
      folder: "/mood-music/posters",
    }),
  ]);

  const song = await songModel.create({
    title: tags.title,
    url: songFile.url,
    posterUrl: posterFile.url,
    mood,
    artist: tags.artist,
    publisher: tags.publisher,
    year: tags.year,
    album: tags.album,
  });

  res.status(201).json({
    success: true,
    message: "song created successfully!!!",
    song,
  });
}

async function getSong(req, res) {
  const { mood } = req.query;

  const song = await songModel.findOne({
    mood,
  });

  res.status(200).json({
    success: true,
    message: "song fetched successfully!!!",
    song,
  });
}

module.exports = {
  uploadSong,
  getSong,
};
