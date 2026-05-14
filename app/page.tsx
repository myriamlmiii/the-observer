import { BrainCircuit, Sparkles, Telescope } from "lucide-react";
import HomeHero from "@/components/HomeHero";

export default function Home() {
  return (
    <div className="bg-[#02030a] text-white">
      <HomeHero />

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28">
        <div className="mt-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <section className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition will-change-transform hover:-translate-y-1 hover:border-cyan-300/25 hover:shadow-[0_0_60px_rgba(103,232,249,0.08)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-200">
              <Telescope className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="mt-5 font-[family-name:var(--font-syne)] text-sm font-bold uppercase tracking-[0.16em] text-white/92">
              Synthetic Universes
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Switch regimes and perturb dynamics to see order, chaos, and resonance emerge.
            </p>
          </section>

          <section className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition will-change-transform hover:-translate-y-1 hover:border-violet-300/25 hover:shadow-[0_0_60px_rgba(167,139,250,0.08)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-400/10 text-violet-200">
              <BrainCircuit className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="mt-5 font-[family-name:var(--font-syne)] text-sm font-bold uppercase tracking-[0.16em] text-white/92">
              Observer Inference
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Live cognition outputs uncertainty, horizon collapse, and hypothesis pressure in real time.
            </p>
          </section>

          <section className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition will-change-transform hover:-translate-y-1 hover:border-fuchsia-300/25 hover:shadow-[0_0_60px_rgba(240,171,252,0.08)] sm:col-span-2 lg:col-span-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-fuchsia-400/10 text-fuchsia-200">
              <Sparkles className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="mt-5 font-[family-name:var(--font-syne)] text-sm font-bold uppercase tracking-[0.16em] text-white/92">
              Law Discovery
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              When trajectories compress, symbolic candidates surface with confidence estimates.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
