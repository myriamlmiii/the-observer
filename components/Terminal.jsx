"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function Terminal({ logs }) {
  return (
    <div className="h-64 overflow-hidden rounded-3xl border border-cyan-300/10 bg-black/50 p-4 font-mono text-xs leading-6 text-cyan-100">
      <AnimatePresence initial={false}>
        {logs.slice(-10).map((log, i) => (
          <motion.div
            key={`${log}-${i}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >
            <span className="text-fuchsia-300">observer://</span> {log}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}