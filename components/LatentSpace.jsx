"use client";

import { motion } from "framer-motion";

export default function LatentSpace({
  universes = [],
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 p-5 backdrop-blur-2xl">
      <div className="mb-4">
        <div className="text-[10px] uppercase tracking-[0.26em] text-white/35">
          latent manifold
        </div>

        <div className="mt-2 text-2xl font-black">
          Geometry of scientific understanding
        </div>
      </div>

      <div className="relative h-[340px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#02030a]">
        <svg viewBox="0 0 800 340" className="h-full w-full">
          {Array.from({ length: 16 }, (_, i) => (
            <line
              key={i}
              x1={(i / 15) * 800}
              y1="0"
              x2={(i / 15) * 800}
              y2="340"
              stroke="#67e8f9"
              strokeOpacity="0.05"
            />
          ))}

          {Array.from({ length: 10 }, (_, i) => (
            <line
              key={i + "h"}
              x1="0"
              y1={(i / 9) * 340}
              x2="800"
              y2={(i / 9) * 340}
              stroke="#67e8f9"
              strokeOpacity="0.05"
            />
          ))}

          {universes.map((u, i) => (
            <g key={i}>
              <motion.circle
                cx={u.x}
                cy={u.y}
                r={u.size}
                fill={u.color}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 0.9,
                  cx: u.x + Math.sin(i) * 3,
                  cy: u.y + Math.cos(i) * 3,
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />

              <text
                x={u.x + 12}
                y={u.y}
                fill="rgba(255,255,255,.45)"
                fontSize="10"
              >
                {u.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <p className="mt-4 text-sm leading-8 text-white/50">
        Universes cluster according to
        entropy, compressibility, and
        prediction stability.
      </p>
    </div>
  );
}