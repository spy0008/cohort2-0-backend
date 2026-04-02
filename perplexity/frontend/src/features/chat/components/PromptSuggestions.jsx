import { motion } from "framer-motion";

const prompts = [
  "🚀 Build a SaaS landing page",
  "💡 Startup ideas for 2026",
  "⚡ Improve my React app UI",
  "🧠 Explain AI like I'm 10",
];

const PromptSuggestions = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 max-w-2xl mx-auto">
      {prompts.map((text, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => onSelect(text)}
          className="
            text-left cursor-pointer px-4 py-3 rounded-xl
            bg-gray-100 hover:bg-gray-200
            dark:bg-white/5 dark:hover:bg-white/10
            border border-gray-200 dark:border-white/10
            text-sm text-gray-700 dark:text-white/80
            hover:text-black dark:hover:text-white
            transition backdrop-blur-md
          "
        >
          {text}
        </motion.button>
      ))}
    </div>
  );
};

export default PromptSuggestions;