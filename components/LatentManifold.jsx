"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";

function LatentManifold({ analysis, mode, latentPoints }) {
  const palette = mode === "gravity" ? "#67e8f9" : mode === "chaos" ? "#fb7185" : "#f0abfc";

  const bounds = useMemo(() => ({ w: 220, h: 170 }), []);

  const thesis = useMemo(() => {

    const h = analysis.horizonCollapse;

    if (h > 0.62) return "clusters fragment while horizons dominate";

    if (analysis.compressibility > 0.68) return "compressible attractors aligning";

    return "manifold still mixing while hypotheses compete";

  }, [analysis.compressibility, analysis.horizonCollapse]);

  return (

    <div className="relative overflow-hidden rounded-2xl border border-cyan-300/14 bg-black/42 p-4 shadow-inner shadow-black/40">

      <div className="mb-3 flex justify-between gap-3">

        <div>

          <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-fuchsia-200/72">

            latent manifold

          </p>

          <p className="mt-2 max-w-[16rem] text-[11px] leading-relaxed text-white/72">{thesis}</p>

        </div>

        <div className="text-right font-mono text-[10px] text-cyan-200/72">

          <div>h = {analysis.entropy?.toFixed(2)}</div>

          <div>λ⋆ ≈ {analysis.divergence?.toFixed(2)}</div>

        </div>

      </div>

      <svg viewBox={`0 0 ${bounds.w} ${bounds.h}`} className="h-48 w-full">

        <defs>

          <radialGradient id="manifoldGlow" cx="40%" cy="35%" r="70%">

            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.09" />

            <stop offset="100%" stopColor="#020617" stopOpacity="0.22" />

          </radialGradient>

        </defs>

        <rect width={bounds.w} height={bounds.h} rx={16} fill="url(#manifoldGlow)" />

        <line x1="22" y1="146" x2="198" y2="146" stroke="#67e8f9" opacity={0.1} />

        <line x1="22" y1="138" x2="198" y2="138" stroke="#a78bfa" opacity={0.08} />

        <line x1="22" y1="24" x2="22" y2="146" stroke="#ffffff" opacity={0.08} />

        {latentPoints.map((p, i) => (
          <motion.circle
            key={p.i}
            cx={p.x}
            cy={p.y}
            r={2.9}
            fill={palette}
            opacity={0.88}
            initial={{ opacity: 0.12 }}
            animate={{ opacity: 0.9, cy: [p.y, p.y + analysis.horizonCollapse * -5, p.y], cx: p.x }}

            transition={{ duration: 3.8 + i * 0.02, repeat: Infinity }}

          />

        ))}

        <motion.circle cx={bounds.w / 2} cy={bounds.h / 2} r={6} stroke="#fb923c" strokeOpacity={0.45} fill="none" animate={{ opacity: [0.2, 0.75, 0.2], r: [5, analysis.compressibility * 18 + 4, 5] }} transition={{ duration: 4.8, repeat: Infinity }} />

        <text x="30" y="28" fill="rgba(255,255,255,.38)" fontSize="9">

          embedding · representation space · live

        </text>

      </svg>

    </div>

  );

}

export default memo(LatentManifold);
