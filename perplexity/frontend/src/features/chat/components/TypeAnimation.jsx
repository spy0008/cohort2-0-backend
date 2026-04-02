export const TypingLoader = () => {
  return (
    <div className="flex items-center gap-1 px-2 py-1">
      <span className="w-2 h-2 bg-gray-500 dark:bg-white/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2 h-2 bg-gray-500 dark:bg-white/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2 h-2 bg-gray-500 dark:bg-white/60 rounded-full animate-bounce" />
    </div>
  );
};
