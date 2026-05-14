"use client";

function fmt(v, d = 3) {
  return Number.isFinite(v) ? v.toFixed(d) : "n/a";
}

function Metric({ label, value, tone = "cyan" }) {
  const toneClasses =
    tone === "fuchsia"
      ? "border-fuchsia-300/20 bg-fuchsia-300/5 text-fuchsia-100"
      : tone === "violet"
      ? "border-violet-300/20 bg-violet-300/5 text-violet-100"
      : tone === "orange"
      ? "border-orange-300/20 bg-orange-300/5 text-orange-100"
      : "border-cyan-300/20 bg-cyan-300/5 text-cyan-100";

  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/40 p-4 backdrop-blur-xl">
      <div className="text-[10px] font-medium uppercase tracking-[0.34em] text-white/45">
        {label}
      </div>
      <div className={`mt-2 inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs ${toneClasses}`}>
        {value}
      </div>
    </div>
  );
}

export default function ScientificHUD({ analysis }) {
  return (
    <div className="grid gap-3">
      <Metric label="Entropy" value={fmt(analysis.entropy, 3)} tone="cyan" />
      <Metric label="Prediction error" value={fmt(analysis.predictionError, 3)} tone="orange" />
      <Metric label="Compressibility" value={fmt(analysis.compressibility, 3)} tone="violet" />
      <Metric label="Horizon collapse" value={fmt(analysis.horizonCollapse, 3)} tone="fuchsia" />
      <Metric label="Causal coherence" value={fmt(analysis.causalCoherence, 3)} tone="cyan" />
    </div>
  );
}
