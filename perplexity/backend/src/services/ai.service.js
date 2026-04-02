import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  tool,
  createAgent,
} from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistral = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const searchInternetTool = tool(searchInternet, {
  name: "searchInternet",
  description:
    "Use thie tool to search the internet for relevent information to answer queries. Input should be a search, query string, and output will be a list of search result.",
  schema: z.object({
    query: z.string().describe("The search query to look up on the internet."),
  }),
});

const agent = createAgent({
  model: gemini,
  tools: [searchInternetTool],
});
export async function generateResponse(messages) {
  const response = await agent.invoke({
    messages: [
      new SystemMessage(
        `You are a helpful and precise assistent for answering questions. If you don't know the answer, say you don't know.  If the question required up-to-date information , use the "searchInternet" tool to get the latest information or dates from the internet and then answer based on the search results.`,
      ),
      ...messages.map((msg) => {
        if (msg.role == "user") {
          return new HumanMessage(msg.content);
        } else if (msg.role == "ai") {
          return new AIMessage(msg.content);
        }
      }),
    ],
  });

  return response.messages[response.messages.length - 1].text;
}

export async function generateChatTitle(message) {
  const response = await mistral.invoke([
    new SystemMessage(`You are a  helpful assistant that generates concise and descriptive titles for chat conversations. 
      User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 3-4 words. The title should be clear, relevant, and engaging, giving ysers a quick understanding of the chat's topic.
      `),

    new HumanMessage(`
      Generate a title for a chat conversation based on the following first message: "${message}"
      `),
  ]);

  return response.text;
}
