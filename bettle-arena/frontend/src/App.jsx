import "./App.css";
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";

/* ---------------- SMART DETECTION ---------------- */

const detectLanguage = (code) => {
  if (code.includes("def ")) return "python";
  if (code.includes("function") || code.includes("=>")) return "javascript";
  if (code.includes("{") && code.includes("}")) return "json";
  if (code.includes("class ")) return "java";
  return "javascript";
};

const isCodeBlock = (text) => {
  return (
    text.includes("{") ||
    text.includes("function") ||
    text.includes("=>") ||
    text.includes("def ") ||
    text.includes(";")
  );
};

/* ---------------- CODE / TEXT RENDER ---------------- */

const CodeBlock = ({ code }) => {
  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const isCode = isCodeBlock(code);
  const language = detectLanguage(code);

  return (
    <div className="relative">
      <button
        onClick={copyCode}
        className="absolute right-2 top-2 text-xs cursor-pointer active:scale-95 transition-all duration-200 bg-white/10 px-2 py-1 rounded-md hover:bg-white/20"
      >
        Copy
      </button>

      {isCode ? (
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            borderRadius: "10px",
            fontSize: "13px",
            margin: 0,
          }}
        >
          {code}
        </SyntaxHighlighter>
      ) : (
        <div className="bg-black/20 rounded-lg p-3 text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">
          {code}
        </div>
      )}
    </div>
  );
};

/* ---------------- SOLUTION CARD ---------------- */

const SolutionCard = ({ title, score, reasoning, code, winner }) => {
  return (
    <div
      className={`rounded-xl p-4 border transition-all ${
        winner
          ? "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
          : "border-slate-700"
      } bg-slate-800/30`}
    >
      <div className="flex justify-between text-xs text-slate-400 mb-2">
        <span className="flex items-center gap-2">
          {title}
          {winner && (
            <span className="text-[10px] px-2 py-0.5 bg-green-500/20 text-green-400 rounded">
              Winner
            </span>
          )}
        </span>

        <span className="text-[12px] text-white">Score : {score} / 10</span>
      </div>

      <CodeBlock code={code} />

      <div className="mt-3 text-[13px] text-slate-400 leading-relaxed">
        <span className="text-white text-[14px]">Reasoning: </span>
        {reasoning}
      </div>
    </div>
  );
};

/* ---------------- MAIN APP ---------------- */

const App = () => {
  const [input, setInput] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    if (!input.trim()) return;

    const response = await axios.post("http://localhost:3000/invoke", {
      input: input,
    });

    const data = response.data;

    const newChat = {
      id: Date.now(),
      question: input,
      battle: data.result,
    };


    setChats((prev) => [...prev, newChat]);
    setInput("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#100d0d] text-slate-300 flex">
      {/* SIDEBAR */}
      <div className="w-64 border-r border-white/30 p-4 hidden md:block">
        <h1 className="text-lg font-semibold text-white mb-6">Arena</h1>

        <div className="space-y-3 text-sm text-slate-200">
          <div className="hover:text-slate-400 cursor-pointer">New Chat</div>
          <div className="hover:text-slate-400 cursor-pointer">Leaderboard</div>
          <div className="hover:text-slate-400 cursor-pointer">Search</div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/30">
          <div className="text-sm text-slate-200">⚔️ Battle Mode</div>
          <button className="text-sm bg-white text-black px-3 py-1 rounded-md cursor-pointer active:scale-95 transition-all duration-200">
            Login
          </button>
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-10">
          {chats.map((chat) => {
            const winner =
              chat.battle.judge.solution_2_score >
              chat.battle.judge.solution_1_score
                ? 2
                : 1;

            return (
              <div key={chat.id} className="space-y-6">
                {/* USER */}
                <div className="flex justify-end">
                  <div className="bg-slate-800/50 px-4 py-2 rounded-full text-slate-100 text-sm border border-slate-700">
                    {chat.question}
                  </div>
                </div>

                {/* SOLUTIONS */}
                <div className="grid md:grid-cols-2 gap-5">
                  <SolutionCard
                    title="Model 1"
                    score={chat.battle.judge.solution_1_score}
                    reasoning={chat.battle.judge.solution_1_reasoning}
                    code={chat.battle.solution_1}
                    winner={winner === 1}
                  />

                  <SolutionCard
                    title="Model 2"
                    score={chat.battle.judge.solution_2_score}
                    reasoning={chat.battle.judge.solution_2_reasoning}
                    code={chat.battle.solution_2}
                    winner={winner === 2}
                  />
                </div>

                {/* WINNER */}
                <div className="text-center text-xs text-slate-500">
                  Winner:{" "}
                  <span className="text-green-400 font-medium">
                    Model {winner}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-slate-200/30">
          <div className="max-w-3xl mx-auto flex items-center gap-2 bg-slate-800/30 border border-slate-700 rounded-xl px-3 py-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button
              onClick={handleSend}
              className="text-sm px-3 py-1 bg-white text-black rounded-md cursor-pointer active:scale-95 transition-all duration-200"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
