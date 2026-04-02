import configs from "../config/config.js";
import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";

export const geminiModel = new ChatGoogle({
  model: "gemini-flash-latest",
  apiKey: configs.GEMENI_API_KEY,
});

export const mistralModel = new ChatMistralAI({
  model: "mistral-medium-latest",
  apiKey: configs.MISTRAL_API_KEY,
});

export const mistralAI = new ChatMistralAI({
  model: "mistral-large-latest",
  apiKey: configs.MISTRAL_API_KEY,
});