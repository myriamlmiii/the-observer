"use client";

import { motion } from "framer-motion";
import { WORLD } from "@/lib/world";

const MW = 200;
const MH = 110;

export default function FieldMinimap({ bodies, blackHoles, analysis }) {
  const scaleX = MW / WORLD.W;
  const scaleY = MH / WORLD.H;

  return (
    <div className="obs-minimap hud-float">
      <div className="obs-minimap-label">field manifold · coarse projection</div>
      <svg viewBox={`0 0 ${MW} ${MH}`} className="h-[110px] w-[200px]">
        <defs>
          <radialGradient id="mmGlow" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={MW} height={MH} fill="#020617" opacity="0.85" rx="10" />

        <rect width={MW} height={MH} fill="url(#mmGlow)" opacity="0.6" />

        {Array.from({ length: 7 }, (_, i) => (
          <line
            key={`v-${i}`}
            x1={(i / 6) * MW}
            y1={0}
            x2={(i / 6) * MW}
            y2={MH}
            stroke="#334155"
            strokeOpacity={0.25}
          />
        ))}

        {blackHoles.map((h, i) => (
          <motion.circle
            key={`bh-${i}`}
            cx={h.x * scaleX}
            cy={h.y * scaleY}
            r={4}
            fill="#fb7185"
            animate={{ opacity: [0.4, 0.95, 0.4], r: [3.5, 5.2, 3.5] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.12 }}
          />
        ))}

        {bodies.slice(0, 120).map((b, idx) => (
          <circle
            key={String(b.id)}
            cx={b.x * scaleX}
            cy={b.y * scaleY}
            r={b.type === "star" ? 3.6 : 1.3}
            fill={b.type === "star" ? "#fde68a" : idx % 3 === 0 ? "#67e8f9" : "#e9d5ff"}
            opacity={0.35 + analysis.compressibility * 0.4}
          />
        ))}

        <rect
          width={MW}
          height={MH}
          fill="none"
          stroke={`rgba(34,211,238,${0.12 + analysis.causalCoherence * 0.2})`}
          strokeWidth={1}
          rx={10}
        />
      </svg>
    </div>
  );
}
