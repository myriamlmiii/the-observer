"use client";

import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCallback, useRef } from "react";

function useMagnet(strength = 18) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ref = useRef(null);

  const onMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      x.set((dx / r.width) * strength);
      y.set((dy / r.height) * strength);
    },
    [strength, x, y],
  );

  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { ref, x, y, onMove, onLeave };
}

function MagnetLink({ href, children, className, strength = 18 }) {
  const { ref, x, y, onMove, onLeave } = useMagnet(strength);

  return (
    <motion.div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} style={{ x, y }}>
      <Link href={href} className={className}>
        {children}
      </Link>
    </motion.div>
  );
}

export default function HomeHero() {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.35);
  const bg = useMotionTemplate`radial-gradient(800px 520px at ${mx} ${my}, rgba(103,232,249,0.18), transparent 60%), radial-gradient(720px 560px at ${mx} ${my}, rgba(240,171,252,0.14), transparent 58%), radial-gradient(860px 600px at 70% 80%, rgba(167,139,250,0.10), transparent 62%)`;

  return (
    <div className="relative overflow-hidden bg-[#02030a] text-white">
      <motion.div className="pointer-events-none absolute inset-0" style={{ backgroundImage: bg }} />

      <div
        className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(((e.clientX - r.left) / r.width) * 100 + "%");
          my.set(((e.clientY - r.top) / r.height) * 100 + "%");
        }}
      >
        <p className="font-[family-name:var(--font-mono)] text-[11px] font-light uppercase tracking-[0.52em] text-cyan-200/50">
          Classified scientific interface
        </p>

        <motion.h1
          className="obs-hero-title mt-8 max-w-5xl text-[clamp(2.6rem,6.2vw,4.6rem)] leading-[1.05] font-light"
          animate={{ backgroundPositionX: ["0%", "100%", "0%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundSize: "220% 100%",
          }}
        >
          Science begins when reality becomes compressible.
        </motion.h1>

        <p className="mt-7 max-w-3xl text-lg leading-relaxed text-slate-400">
          A synthetic observer studies motion, entropy, prediction, and causality to discover whether a universe permits
          laws.
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <MagnetLink
            href="/observe"
            strength={22}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400/90 to-violet-400/90 px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:brightness-110"
          >
            Enter Observation Field <ArrowRight className="h-4 w-4" aria-hidden />
          </MagnetLink>

          <MagnetLink
            href="/method"
            strength={16}
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.02] px-8 py-3.5 text-sm font-medium text-white/85 transition hover:bg-white/[0.05]"
          >
            Read Method
          </MagnetLink>
        </div>
      </div>
    </div>
  );
}
