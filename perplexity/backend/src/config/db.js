import mongoose from "mongoose";

export function connectToDB() {
  try {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        console.log("Database connected successfully!!!");
      })
      .catch((error) => {
        console.log("Database Connection Failed: " + error);
      });
  } catch (error) {
    console.log(error);
  }
}
