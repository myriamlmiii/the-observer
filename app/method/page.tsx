import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Method · The Observer",
  description: "How the synthetic observer summarizes entropy, prediction error, and symbolic structure.",
};

export default function MethodPage() {
  return (
    <div className="bg-[#02030a] text-white">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="font-[family-name:var(--font-mono)] text-[11px] font-light uppercase tracking-[0.45em] text-cyan-200/50">
          Instrument note
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-light text-white sm:text-5xl">
          What the readings mean
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-slate-400">
          The lab visualizes heuristic summaries of particle motion. Useful for intuition, not ground truth physics.
        </p>

        <div className="mt-14 space-y-12">
          <section>
            <h2 className="font-[family-name:var(--font-syne)] text-sm font-bold uppercase tracking-[0.2em] text-violet-200/95">
              Entropy-like spread
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-slate-400">
              Speeds across bodies are histogrammed into bins; dispersion in that histogram is treated as uncertainty in
              the motion pattern. Higher values usually mean irregular or broad velocity structure.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-syne)] text-sm font-bold uppercase tracking-[0.2em] text-violet-200/95">
              Prediction error
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-slate-400">
              Earlier frames are reused to extrapolate particle positions briefly forward. Larger mismatch between
              predicted and realized positions lowers confidence and raises horizon collapse style signals. This is a proxy for
              short-term instability.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-syne)] text-sm font-bold uppercase tracking-[0.2em] text-violet-200/95">
              Compressibility
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-slate-400">
              Combines dispersion, entropy proxy, spatial spread, and recent prediction error into a scalar that trends
              up when motions look orderly enough to summarize. When it is low, the visualization down-ranks invariant
              language.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-syne)] text-sm font-bold uppercase tracking-[0.2em] text-violet-200/95">
              Chaos and horizon collapse
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-slate-400">
              Horizon collapse rises when prediction error and divergence grow, indicating trajectories are becoming
              sensitive to small perturbations. In this state, stable symbolic summaries are harder to maintain.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-syne)] text-sm font-bold uppercase tracking-[0.2em] text-violet-200/95">
              Causal edges on screen
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-slate-400">
              Lines join nearby particles with strength falling off by distance. They illustrate coupling density, not
              experimental causality.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-syne)] text-sm font-bold uppercase tracking-[0.2em] text-violet-200/95">
              Law discovery
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-slate-400">
              When compressibility is high and entropy is moderate, the system surfaces short symbolic candidates with a
              confidence estimate. These are heuristics meant to support visual storytelling.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-syne)] text-sm font-bold uppercase tracking-[0.2em] text-violet-200/95">
              Controls
            </h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-[15px] leading-8 text-slate-400">
              <li>Gravity coupling scales pairwise attraction alongside regime specific biases.</li>
              <li>Entropy bath injects stochastic kick into velocities each tick.</li>
              <li>Force injection nudges all bodies from the click vector; singularities attract strongly.</li>
            </ul>
          </section>
        </div>

        <Link
          href="/observe"
          className="mt-14 inline-flex rounded-xl border border-cyan-400/35 bg-cyan-400/10 px-6 py-3 text-sm font-medium text-cyan-100 hover:bg-cyan-400/15"
        >
          Return to observation field
        </Link>
      </div>
    </div>
  );
}
