"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nextObserverLines } from "@/lib/observerStream";
import { pickDiscoveryLine } from "@/lib/observerDiscovery";

function TypingLine({ text, danger = false, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(6px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.3, delay }}
      className={`obs-cognition-line font-[family-name:var(--font-mono),ui-monospace] text-[11px] font-light leading-relaxed ${
        danger ? "text-rose-200/80" : "text-sky-100/78"
      }`}
      style={{ textShadow: danger ? "0 0 26px rgba(251,113,133,0.22)" : "0 0 24px rgba(125,211,252,0.25)" }}
    >
      <span className="mr-2 text-fuchsia-300/60">*</span>
      <motion.span
        className="inline-block align-baseline"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 0.75, ease: "easeOut", delay }}
      >
        {text}
      </motion.span>
      <motion.span
        className="ml-1 inline-block h-[1em] w-[0.55ch] bg-cyan-200/70 align-text-bottom"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.1, repeat: Infinity }}
        aria-hidden
      />
    </motion.div>
  );
}

export default function ObserverCognition({ tick, mode, analysis, primaryLawTitle }) {
  const lawSummary = primaryLawTitle ? `inference focus ${primaryLawTitle}` : null;
  const discovery = pickDiscoveryLine(tick, analysis, mode, primaryLawTitle ?? "none");

  const lines = useMemo(
    () => nextObserverLines(tick, mode, analysis, lawSummary),
    [tick, mode, analysis, lawSummary],
  );

  const danger = analysis.entropy > 0.72 || analysis.horizonCollapse > 0.62 || analysis.confidence < 35;

  return (
    <div className="obs-cognition">
      <div className="obs-cognition-glow" aria-hidden />

      <div className="mb-3 font-[family-name:var(--font-mono),ui-monospace] text-[9px] font-extralight uppercase tracking-[0.55em] text-cyan-200/45">
        observer cognition stream
      </div>

      <AnimatePresence mode="popLayout">
        {lines.map((line, i) => (
          <motion.div key={`${tick}-${i}-${line.slice(0, 16)}`} layout>
            <TypingLine text={line} danger={danger && i === 0} delay={i * 0.05} />
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        className="mt-4 border-t border-white/[0.06] pt-3 font-[family-name:var(--font-mono),ui-monospace] text-[10px] font-extralight text-violet-200/50"
        animate={{
          opacity: [0.45, 0.92, 0.45],
          textShadow: danger
            ? ["0 0 0 rgba(0,0,0,0)", "0 0 18px rgba(251,113,133,0.24)", "0 0 0 rgba(0,0,0,0)"]
            : ["0 0 0 rgba(0,0,0,0)", "0 0 18px rgba(103,232,249,0.18)", "0 0 0 rgba(0,0,0,0)"],
        }}
        transition={{ duration: 3.8, repeat: Infinity }}
      >
        {discovery}
      </motion.div>
    </div>
  );
}
