"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ScientificHUD from "@/components/ScientificHUD";

function usePulseOnChange(value, threshold = 0.015) {
  const prev = useRef(value);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    setChanged(Math.abs(value - prev.current) > threshold);
    prev.current = value;
  }, [threshold, value]);

  return changed;
}

export default function MetricsPanel({ analysis, open, setOpen }) {
  const chaosPulse = usePulseOnChange(analysis.horizonCollapse, 0.02);
  const orderPulse = usePulseOnChange(analysis.compressibility, 0.02);

  const glow =
    analysis.horizonCollapse > 0.55
      ? "shadow-[0_0_70px_rgba(251,113,133,0.10)]"
      : analysis.compressibility > 0.65
      ? "shadow-[0_0_70px_rgba(103,232,249,0.10)]"
      : "";

  return (
    <div className={`rounded-2xl border border-white/[0.08] bg-black/30 backdrop-blur-xl ${glow}`}>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div>
          <div className="font-[family-name:var(--font-syne)] text-xs font-bold uppercase tracking-[0.2em] text-white/80">
            Metrics
          </div>
          <div className="mt-1 font-[family-name:var(--font-mono)] text-[10px] font-light uppercase tracking-[0.28em] text-white/40">
            live instrument readings
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="h-4 w-4 text-white/55" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <motion.div
              className="p-4"
              animate={{
                boxShadow: chaosPulse
                  ? ["0 0 0 rgba(0,0,0,0)", "0 0 40px rgba(251,113,133,0.08)", "0 0 0 rgba(0,0,0,0)"]
                  : orderPulse
                  ? ["0 0 0 rgba(0,0,0,0)", "0 0 40px rgba(103,232,249,0.08)", "0 0 0 rgba(0,0,0,0)"]
                  : "0 0 0 rgba(0,0,0,0)",
              }}
              transition={{ duration: 0.8 }}
            >
              <ScientificHUD analysis={analysis} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
