import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatCohere } from "@langchain/cohere";
import envConfig from "../config/config.js";

export const geminiModel = new ChatGoogle({
  model: "gemini-flash-latest",
  apiKey: envConfig.GEMINI_API_KEY,
});

export const mistralModel = new ChatMistralAI({
  model: "mistral-medium-latest",
  apiKey: envConfig.MISTRAL_API_KEY,
});

export const cohereModel = new ChatCohere({
  model: "command-a-03-2025",
  apiKey: envConfig.COHERE_API_KEY,
});
