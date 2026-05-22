import "dotenv/config";
import app from "./src/app.js";

app.listen(3000, () => {
  console.log("AI Orchestration server running on port 3000");
});
