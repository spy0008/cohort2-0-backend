const mongoose = require("mongoose");

function connectToDB() {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Database connected successfully!!!");
    })
    .catch((error) => {
      console.log("Database Connection Failed: " + error);
    });
}

module.exports = connectToDB;
