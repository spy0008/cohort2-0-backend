require("dotenv").config();
const app = require("./src/app.js");
const connectToDB = require("./src/config/database.js");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server in running ${PORT}`);
  connectToDB();
});
