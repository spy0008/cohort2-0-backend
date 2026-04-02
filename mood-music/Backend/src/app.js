const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("../src/routes/auth.route.js");
const songRouter = require("./routes/song.route.js");

const app = express();

//configs
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/auth", userRouter);
app.use("/api/songs", songRouter);

module.exports = app;
