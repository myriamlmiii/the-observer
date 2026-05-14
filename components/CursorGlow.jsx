"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export default function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 110, damping: 28 });
  const sy = useSpring(y, { stiffness: 110, damping: 28 });

  useEffect(() => {
    const move = (event) => {
      x.set(event.clientX - 180);
      y.set(event.clientY - 180);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[90] hidden h-[360px] w-[360px] rounded-full bg-cyan-300/10 blur-3xl md:block"
      style={{ x: sx, y: sy }}
    />
  );
}
