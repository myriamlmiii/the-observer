"use client";

import { motion } from "framer-motion";

export default function CausalGraph({
  bodies = [],
}) {
  const nodes = bodies.slice(0, 12);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/40 p-5 backdrop-blur-2xl">
      <div className="mb-4">
        <div className="text-[10px] uppercase tracking-[0.26em] text-white/35">
          causal estimation graph
        </div>

        <div className="mt-2 text-2xl font-black">
          Influence topology
        </div>
      </div>

      <div className="relative h-[320px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#02030a]">
        <svg viewBox="0 0 600 320" className="h-full w-full">
          {nodes.map((a, i) =>
            nodes.map((b, j) => {
              if (i >= j) return null;

              const dx = a.x - b.x;
              const dy = a.y - b.y;

              const d = Math.sqrt(
                dx * dx + dy * dy
              );

              if (d > 220) return null;

              return (
                <motion.line
                  key={`${i}-${j}`}
                  x1={(a.x / 1200) * 600}
                  y1={(a.y / 720) * 320}
                  x2={(b.x / 1200) * 600}
                  y2={(b.y / 720) * 320}
                  stroke="#67e8f9"
                  strokeOpacity={0.18}
                  animate={{
                    opacity: [0.1, 0.35, 0.1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
              );
            })
          )}

          {nodes.map((n, i) => (
            <motion.circle
              key={i}
              cx={(n.x / 1200) * 600}
              cy={(n.y / 720) * 320}
              r="5"
              fill="#f0abfc"
              animate={{
                r: [5, 7, 5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          ))}
        </svg>
      </div>

      <p className="mt-4 text-sm leading-8 text-white/50">
        The observer estimates causal
        influence between entities based
        on trajectory interactions.
      </p>
    </div>
  );
}