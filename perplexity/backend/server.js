import "dotenv/config";
import app from "./src/app.js";
import http from "http";
import { connectToDB } from "./src/config/db.js";
import { initSocket } from "./src/sockets/server.socket.js";

const port = process.env.PORT || 3000;

const httpServer = http.createServer(app);

initSocket(httpServer);

connectToDB();

httpServer.listen(port, () => {
  console.log(`http server running on port ${port}`);
});
