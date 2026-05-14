"use client";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

export default function LawDiscovery({
  laws = [],
  compact = true,
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/40 p-6 backdrop-blur-2xl">
      <div className="mb-5">
        <div className="text-[10px] uppercase tracking-[0.28em] text-white/35">
          symbolic inference engine
        </div>

        <div className="mt-2 text-2xl font-black">Discovered laws</div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {laws.map((law, i) => (
            <motion.div
              key={law.title}
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="rounded-[1.5rem] border border-cyan-300/10 bg-cyan-300/[0.03] p-5"
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-black">
                  {law.title}
                </div>

                <div className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-3 py-1 text-xs text-fuchsia-100">
                  confidence {law.confidence}%
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-black/50 p-4 font-mono text-cyan-100">
                <motion.span
                  className="block"
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: i * 0.05 }}
                >
                  {law.equation}
                </motion.span>
              </div>

              <div className="mt-4">
                <div className="h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/[0.03]">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-300/90 via-violet-300/70 to-fuchsia-300/80"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(clamp01(law.confidence / 100) * 100)}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  />
                </div>
              </div>

              {!compact && (
                <p className="mt-4 text-sm leading-7 text-white/55">
                  {law.description}
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}