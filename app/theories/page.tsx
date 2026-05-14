import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Theories · The Observer",
  description: "Symbolic law fragments and heuristic discovery lines from the Observer engine.",
};

const CANDIDATES = [
  {
    title: "Low entropy plateau",
    equation: "ΔS/Δt ≈ 0",
    trigger: "When speed histogram dispersion stays narrow over time.",
  },
  {
    title: "Compressible bundle",
    equation: "K(x) << |x|",
    trigger: "When compressibility score exceeds heuristic threshold alongside moderate entropy.",
  },
  {
    title: "Amplifying separation",
    equation: "δx(t) ≈ e^λt",
    trigger: "When divergence metric across frames stays high.",
  },
  {
    title: "Inverse-square attraction (candidate)",
    equation: "F ∝ m/r²",
    trigger: "When gravity regime repeatedly produces orbital structure compressible by a central law.",
  },
];

export default function TheoriesPage() {
  return (
    <div className="bg-[#030712] text-white">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="font-[family-name:var(--font-mono)] text-[11px] font-light uppercase tracking-[0.45em] text-fuchsia-200/50">
          Symbolic projection
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-light text-white sm:text-5xl">
          Theories the UI may surface
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-slate-400">
          These fragments are illustrative labels wired to heuristic thresholds in{" "}
          <code className="rounded-md bg-white/[0.06] px-1.5 py-0.5 font-mono text-sm text-violet-200/90">
            discoverLaws
          </code>
          . They emerge and disappear as you change regimes or perturb the map.
        </p>

        <ul className="mt-14 space-y-6">
          {CANDIDATES.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-[family-name:var(--font-syne)] text-sm font-bold uppercase tracking-[0.14em] text-white/90">
                  {item.title}
                </h2>
              </div>
              <p className="obs-equation-glow mt-4 font-[family-name:var(--font-mono)] text-base">{item.equation}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.trigger}</p>
            </li>
          ))}
        </ul>

        <p className="mt-14 text-sm leading-relaxed text-slate-500">
          Discovery lines streamed in the observation view mix catalog lines with entropy and horizon checks in{" "}
          <code className="rounded bg-white/[0.06] px-1 font-mono text-xs">observerDiscovery</code>. They are readable as mood
          telemetry, not lab measurements.
        </p>

        <Link
          href="/observe"
          className="mt-10 inline-flex rounded-xl border border-fuchsia-400/35 bg-fuchsia-400/10 px-6 py-3 text-sm font-medium text-fuchsia-100 hover:bg-fuchsia-400/15"
        >
          Run the field
        </Link>
      </div>
    </div>
  );
}
