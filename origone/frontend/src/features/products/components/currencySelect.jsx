import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CurrencySelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const CURRENCIES = ["INR", "USD", "EUR", "GBP"];

  return (
    <div className="relative">
   
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl flex justify-between items-center hover:border-[#C6A96B]/50 transition"
      >
        <span>{value}</span>
        <span>▾</span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute w-full mt-2 bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50"
          >
            {CURRENCIES.map(c => (
              <div
                key={c}
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                }}
                className="px-4 py-3 hover:bg-[#C6A96B]/20 cursor-pointer transition"
              >
                {c}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrencySelect