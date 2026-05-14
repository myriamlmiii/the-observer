import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | The Observer",
  description: "About the Observer interface and its speculative scientific framing.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#02030a] text-white">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="font-[family-name:var(--font-mono)] text-[11px] font-light uppercase tracking-[0.45em] text-fuchsia-200/50">
          About
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-light text-white sm:text-5xl">
          A cinematic instrument for emergent structure
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-slate-400">
          The Observer is a speculative interface for watching simple simulated dynamics become readable. It treats
          motion, uncertainty, and symbolic compression as a visual system rather than a claim about real physics.
        </p>
        <p className="mt-5 text-[15px] leading-8 text-slate-500">
          The observation page is the primary experience: a live field with regime controls, interaction tools,
          telemetry, and law discovery fragments that respond to the simulation state.
        </p>
        <Link
          href="/observe"
          className="mt-10 inline-flex rounded-lg border border-fuchsia-400/35 bg-fuchsia-400/10 px-6 py-3 text-sm font-medium text-fuchsia-100 hover:bg-fuchsia-400/15"
        >
          Enter the field
        </Link>
      </div>
    </div>
  );
}
