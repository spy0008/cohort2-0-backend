import {
  StateSchema,
  MessagesValue,
  StateGraph,
  START,
  END,
  ReducedValue,
} from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { z } from "zod";
import { geminiModel, mistralModel, mistralAI } from "./models.service.js";
import { createAgent, providerStrategy } from "langchain";

// type JUDGMENT = {
//   winner: "solution_1" | "solution_2";
//   solution_1_score: number;
//   solution_2_score: number;
// };

// type AIBATTLESTATE = {
//   messages: typeof MessagesValue;
//   solution_1: string;
//   solution_2: string;
//   judgment: JUDGMENT;
// };

// const state: AIBATTLESTATE = {
//   messages: MessagesValue,
//   solution_1: "",
//   solution_2: "",
//   judgment: {
//     winner: "solution_1",
//     solution_1_score: 0,
//     solution_2_score: 0,
//   },
// };

const State = new StateSchema({
  messages: MessagesValue,
  solution_1: new ReducedValue(z.string().default(""), {
    reducer: (current, next) => {
      return next;
    },
  }),
  solution_2: new ReducedValue(z.string().default(""), {
    reducer: (current, next) => {
      return next;
    },
  }),
  judge_recommondation: new ReducedValue(
    z.object().default({
      solution_1_score: 0,
      solution_2_score: 0,
    }),
    {
      reducer: (current, next) => {
        return next;
      },
    },
  ),
});

const solutionNode: GraphNode<typeof State> = async (state: typeof State) => {
  const [mistral_solution, gemini_solution] = await Promise.all([
    mistralModel.invoke(state.messages[0].text),
    geminiModel.invoke(state.messages[0].text),
  ]);

  return {
    solution_1: mistral_solution.text,
    solution_2: gemini_solution.text,
  };
};

const judgeNode: GraphNode<typeof State> = async (state: typeof State) => {
  const { solution_1, solution_2 } = state;
  const judge = createAgent({
    model: geminiModel,
    tools: [],
    responseFormat: providerStrategy(
      z.object({
        solution_1_score: z.number().min(0).max(10),
        solution_2_score: z.number().min(0).max(10),
      }),
    ),
  });

  const judgeResponse = await judge.invoke({
    messages: [
      new HumanMessage(
        `You are a judge tasked with evaluating the quality of two solutions to a problem is: ${state.messages[0].text}. The first solution is: ${solution_1}. The second is: ${solution_2}. Please provide a score between 0 and 10 for each solution, Where 0 means the solution is competely icorrect or irrelevent, and 10 mean the solution is perfect and fully addresses the problem.`,
      ),
    ],
  });

  const result = judgeResponse.structuredResponse;
  console.log(result)

  return {
    judge_recommondation: result,
  };
};

const graph = new StateGraph(State)
  .addNode("solution", solutionNode)
  .addNode("judge", judgeNode)
  .addEdge(START, "solution")
  .addEdge("solution", "judge")
  .addEdge("judge", END)
  .compile();

export default async function (userMessage: string) {
  const result = await graph.invoke({
    messages: [new HumanMessage(userMessage)],
  });

  console.log(result);

  return result.messages;
}
