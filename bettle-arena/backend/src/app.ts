import express from "express";
import runGraph from "./ai/graph.ai.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/", async (req, res) => {
    const result = await runGraph("Write an code for Factorial fuction in js")

    res.json(result)
});

export default app;
