const { Router } = require("express");
const upload = require("../middleware/upload.middleware.js");
const { uploadSong, getSong } = require("../controllers/song.controller.js");

const songRouter = Router();

/**
 * @route POST /api/songs/
 */
songRouter.post("/", upload.single("song"), uploadSong);

songRouter.get("/", getSong);

module.exports = songRouter;
