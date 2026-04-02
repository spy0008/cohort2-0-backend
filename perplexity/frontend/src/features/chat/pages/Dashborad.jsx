import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hook/useChat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { motion } from "framer-motion";
import PromptSuggestions from "../components/PromptSuggestions";

import {
  Plus,
  Send,
  Sparkles,
  Menu,
  X,
  Trash2,
  Loader2,
  Settings,
  Share2,
  Clock,
  Sun,
  Moon,
} from "lucide-react";

import { getContent } from "../utils/helper";
import { useTheme } from "../hook/useTheme";

const Dashborad = () => {
  const chat = useChat();
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isSending = useSelector((state) => state.chat.isSending);
  const isDeleting = useSelector((state) => state.chat.isDeleting);

  const bottomRef = useRef(null);

  const filteredChats = Object.values(chats).filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    chat.handleGetChats();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, currentChatId, isSending]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    chat.handleSendMessage({ message, chatId: currentChatId });
    setMessage("");
  };

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId);
    setIsSidebarOpen(false);
  };

  const handleNewChat = () => {
    chat.handleNewChat();
    setIsSidebarOpen(false);
  };

  return (
    <main className="h-screen w-full flex bg-white dark:bg-[#05050a] text-black dark:text-white overflow-hidden">
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static z-50 top-0 left-0 h-full w-64 flex flex-col
          bg-white dark:bg-[#0a0a12]
          border-r border-gray-200 dark:border-white/5
          transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* MOBILE HEADER */}
        <div className="p-4 flex justify-between items-center md:hidden">
          <h2 className="text-sm font-semibold">Chats</h2>
          <button onClick={() => setIsSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* LOGO */}
        <div className="p-5 flex items-center gap-3">
          <div className="w-9 h-9 text-white rounded-xl bg-linear-to-br from-purple-600 to-purple-400 flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <h1 className="text-sm font-semibold">Nexora</h1>
        </div>

        {/* NEW CHAT */}
        <div className="px-4">
          <button
            onClick={handleNewChat}
            className="w-full cursor-pointer flex items-center text-white justify-center gap-2 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-purple-500"
          >
            <Plus size={16} /> New Chat
          </button>
        </div>

        {/* SEARCH */}
        <div className="p-3">
          <input
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 text-sm outline-none"
          />
        </div>

        {/* CHAT LIST */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {filteredChats.map((c) => {
            const isActive = currentChatId === c.id;

            return (
              <div
                key={c.id}
                onClick={() => openChat(c.id)}
                className={`group flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer ${
                  isActive
                    ? "bg-purple-600/80 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70"
                }`}
              >
                <p className="truncate">{c.title}</p>

                <button
                  disabled={isDeleting}
                  onClick={(e) => {
                    e.stopPropagation();
                    chat.handleChatDelete(c.id);
                  }}
                  className="opacity-0 cursor-pointer group-hover:opacity-100"
                >
                  {isDeleting ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <Trash2 className="hover:text-red-500" size={14} />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* PROFILE */}
        <div className="p-4 border-t border-gray-200 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-white/10 flex items-center justify-center text-xs">
              {user?.username?.[0]?.toUpperCase() || "A"}
            </div>
            <div>
              <p className="text-xs">{user?.username || "Alex Rivera"}</p>
              <p className="text-[10px] text-gray-500 dark:text-white/40">
                Profile
              </p>
            </div>
          </div>
          <Settings size={16} className="text-gray-500 dark:text-white/40 cursor-pointer" />
        </div>
      </aside>

      {/* MAIN */}
      <section className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="h-15 flex items-center justify-between px-6 border-b border-gray-200 dark:border-white/5 backdrop-blur-md bg-white/50 dark:bg-white/2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden w-9 h-9 rounded-lg bg-gray-200 dark:bg-white/5 flex items-center justify-center"
            >
              <Menu size={18} />
            </button>
            <h2 className="text-sm font-medium">Chat</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 cursor-pointer rounded-lg bg-gray-200 dark:bg-white/10 flex items-center justify-center"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 flex items-center justify-center">
              <Share2 size={16} />
            </button>

            <button className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 flex items-center justify-center">
              <Clock size={16} />
            </button>
          </div>
        </div>

        {/* CHAT */}
        <div className="messages flex-1 overflow-y-auto px-4 md:px-10 py-6 space-y-6">
          {!currentChatId && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Sparkles size={40} className="text-purple-400 mb-4" />
              <h2 className="text-xl">Welcome to Nexora</h2>
              <p className="text-gray-500 dark:text-white/50">
                How can I help you today?
              </p>
              <PromptSuggestions onSelect={(t) => setMessage(t)} />
            </div>
          )}

          {chats[currentChatId]?.messages?.map((msg, i) => {
            const isUser = msg.role === "user";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isUser ? "justify-end" : "gap-3"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    ✦
                  </div>
                )}

                <div className="max-w-xl">
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      isUser
                        ? "bg-linear-to-r from-purple-600 to-purple-500 text-white"
                        : ""
                    }`}
                  >
                    {isUser ? (
                      msg.content
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                      >
                        {getContent(msg.content)}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {isSending && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                ✦
              </div>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 dark:bg-white/60 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-gray-400 dark:bg-white/60 rounded-full animate-bounce delay-150" />
                <span className="w-2 h-2 bg-gray-400 dark:bg-white/60 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="p-4 md:p-6">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-3 
            bg-gray-100 dark:bg-white/5 
            border border-gray-200 dark:border-white/10 
            backdrop-blur-2xl rounded-2xl px-4 py-3
            shadow-lg shadow-purple-500/10
            focus-within:ring-2 focus-within:ring-purple-500/40
            transition-all duration-300"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400 dark:placeholder:text-white/40"
            />

            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              type="submit"
              disabled={isSending}
              className="cursor-pointer bg-linear-to-r from-purple-600 to-purple-500 px-3 py-2 rounded-xl shadow-md shadow-purple-500/30"
            >
              {isSending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Send size={16} />
              )}
            </motion.button>
          </motion.form>
        </div>
      </section>
    </main>
  );
};

export default Dashborad;