"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export default function CosmicBackground({ intensity = 1 }) {
  const x = useMotionValue(50);
  const y = useMotionValue(42);
  const sx = useSpring(x, { stiffness: 60, damping: 24 });
  const sy = useSpring(y, { stiffness: 60, damping: 24 });

  useEffect(() => {
    const move = (event) => {
      x.set((event.clientX / window.innerWidth) * 100);
      y.set((event.clientY / window.innerHeight) * 100);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#02030a]" aria-hidden>
      <div className="obs-starfield opacity-70" />
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${sx}% ${sy}%, rgba(103,232,249,${0.16 * intensity}), transparent 23rem)`,
        }}
      />
      <motion.div
        className="obs-nebula obs-nebula-a"
        animate={{ scale: [1, 1.08, 1], rotate: [0, 3, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="obs-nebula obs-nebula-b"
        animate={{ scale: [1.04, 0.96, 1.04], rotate: [0, -2, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,transparent_0%,rgba(2,3,10,0.62)_72%)]" />
      <div className="obs-vignette" />
      <div className="obs-grain" />
      <div className="obs-scanlines" />
    </div>
  );
}
