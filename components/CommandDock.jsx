"use client";

import { motion } from "framer-motion";
import {
  Eye,
  Pause,
  Play,
  RefreshCw,
  Radar,
  Sparkles,
  Wand2,
  Zap,
  Network,
  Flame,
  Snowflake,
} from "lucide-react";

function DockButton({ active, tone = "base", icon: Icon, label, onClick, tooltip }) {
  const toneClasses =
    tone === "cyan"
      ? "border-cyan-300/30 hover:border-cyan-300/55 hover:shadow-[0_0_40px_rgba(103,232,249,0.14)]"
      : tone === "fuchsia"
      ? "border-fuchsia-300/30 hover:border-fuchsia-300/55 hover:shadow-[0_0_40px_rgba(240,171,252,0.12)]"
      : tone === "violet"
      ? "border-violet-300/30 hover:border-violet-300/55 hover:shadow-[0_0_40px_rgba(167,139,250,0.12)]"
      : tone === "orange"
      ? "border-orange-300/30 hover:border-orange-300/55 hover:shadow-[0_0_40px_rgba(251,146,60,0.12)]"
      : "border-white/10 hover:border-white/20";

  const activeClasses = active
    ? "bg-white/[0.06] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
    : "bg-white/[0.03] text-white/75";

  return (
    <motion.button
      type="button"
      data-command
      aria-pressed={Boolean(active)}
      aria-label={tooltip ?? label}
      title={tooltip ?? label}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
      onClick={onClick}
      className={`group relative inline-flex h-11 items-center gap-2 rounded-lg border px-3.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/60 ${toneClasses} ${activeClasses}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="h-4 w-4 opacity-90" aria-hidden />
      <span className="hidden whitespace-nowrap sm:inline">{label}</span>
      <span className="pointer-events-none absolute -top-10 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/80 px-2 py-1 text-[11px] font-medium text-white/80 backdrop-blur-md group-hover:block">
        {tooltip ?? label}
      </span>
    </motion.button>
  );
}

export default function CommandDock({
  tool,
  setTool,
  predictionMode,
  setPredictionMode,
  running,
  setRunning,
  scanning,
  setScanning,
  onReset,
  onEntropyUp,
  onStabilize,
  showCausal,
  setShowCausal,
  showLaws,
  setShowLaws,
}) {
  return (
    <div className="sticky bottom-3 z-50" data-command>
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-2 rounded-lg border border-white/[0.08] bg-black/70 p-2.5 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <DockButton
          tone="cyan"
          active={tool === "perturb"}
          icon={Zap}
          label="Inject Force"
          tooltip="Click or drag to inject energy"
          onClick={() => setTool("perturb")}
        />
        <DockButton
          tone="fuchsia"
          active={tool === "blackhole"}
          icon={Wand2}
          label="Create Singularity"
          tooltip="Click to place singularity"
          onClick={() => setTool("blackhole")}
        />
        <DockButton
          tone="violet"
          active={predictionMode}
          icon={Radar}
          label="Predict Future"
          tooltip="Draw future paths"
          onClick={() => setPredictionMode((p) => !p)}
        />
        <DockButton
          tone="base"
          active={!running}
          icon={running ? Pause : Play}
          label={running ? "Pause Time" : "Resume Time"}
          tooltip="Toggle time flow"
          onClick={() => setRunning((r) => !r)}
        />
        <DockButton
          tone="base"
          active={false}
          icon={RefreshCw}
          label="Reset Universe"
          tooltip="Reboot simulation"
          onClick={onReset}
        />
        <DockButton
          tone="cyan"
          active={scanning}
          icon={Eye}
          label="Observer Scan"
          tooltip="Scanning overlay"
          onClick={() => setScanning((s) => !s)}
        />
        <DockButton
          tone="orange"
          active={false}
          icon={Flame}
          label="Increase Entropy"
          tooltip="Increase stochasticity"
          onClick={onEntropyUp}
        />
        <DockButton
          tone="cyan"
          active={false}
          icon={Snowflake}
          label="Stabilize"
          tooltip="Reduce entropy & reset injection"
          onClick={onStabilize}
        />
        <DockButton
          tone="violet"
          active={showCausal}
          icon={Network}
          label="Causal Graph"
          tooltip="Toggle causal graph"
          onClick={() => setShowCausal((v) => !v)}
        />
        <DockButton
          tone="fuchsia"
          active={showLaws}
          icon={Sparkles}
          label="Laws"
          tooltip="Toggle laws"
          onClick={() => setShowLaws((v) => !v)}
        />
      </div>
    </div>
  );
}
