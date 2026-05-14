"use client";

import { motion } from "framer-motion";

export default function AtmosphericShell({ parallax = 0 }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="obs-starfield" aria-hidden />
      <motion.div
        className="obs-nebula obs-nebula-a"
        aria-hidden
        animate={{ opacity: [0.45, 0.72, 0.45], scale: [1, 1.06, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        style={{ x: parallax * 8, y: parallax * -5 }}
      />
      <motion.div
        className="obs-nebula obs-nebula-b"
        aria-hidden
        animate={{ opacity: [0.35, 0.58, 0.35], rotate: [0, 3, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
        style={{ x: parallax * -12 }}
      />
      <div className="obs-vignette" aria-hidden />
      <div className="obs-grain" aria-hidden />
      <div className="obs-scanlines" aria-hidden />
    </div>
  );
}
