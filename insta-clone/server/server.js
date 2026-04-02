require("dotenv").config();
const app = require("./src/app.js");
const connectToDB = require("./src/config/db.js");
const authRouter = require("./src/routers/auth.route.js");
const postRouter = require("./src/routers/post.route.js");
const userRouter = require("./src/routers/user.route.js");

const port = process.env.PORT;

app.listen(port, () => {
  console.log("server running on " + port);
  connectToDB();
});

//auth routes
app.use("/api/auth", authRouter);

//post routes
app.use("/api/post", postRouter);

//user routes
app.use("/api/users", userRouter);
