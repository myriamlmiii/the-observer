import type { Metadata } from "next";
import Link from "next/link";
import { Gauge, Orbit, RadioTower } from "lucide-react";

export const metadata: Metadata = {
  title: "Lab | The Observer",
  description: "Experimental control notes for the Observer simulation.",
};

const PANELS = [
  {
    title: "Regime Switching",
    body: "Use the observation deck to reset the field into gravity, chaos, or swarm dynamics without leaving the route.",
    icon: Orbit,
  },
  {
    title: "Telemetry",
    body: "Track compressibility, entropy, prediction error, and horizon collapse as live instrument readings.",
    icon: Gauge,
  },
  {
    title: "Field Interaction",
    body: "Inject force by clicking or dragging the viewport, or place singularities from the command dock.",
    icon: RadioTower,
  },
];

export default function LabPage() {
  return (
    <div className="bg-[#02030a] text-white">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="font-[family-name:var(--font-mono)] text-[11px] font-light uppercase tracking-[0.45em] text-cyan-200/50">
          Experimental lab
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-light text-white sm:text-5xl">
          Control surfaces for the field
        </h1>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PANELS.map(({ title, body, icon: Icon }) => (
            <section key={title} className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-5">
              <Icon className="h-5 w-5 text-cyan-200/80" aria-hidden />
              <h2 className="mt-5 font-[family-name:var(--font-syne)] text-sm font-bold uppercase tracking-[0.16em] text-white/90">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{body}</p>
            </section>
          ))}
        </div>
        <Link
          href="/observe"
          className="mt-10 inline-flex rounded-lg border border-cyan-400/35 bg-cyan-400/10 px-6 py-3 text-sm font-medium text-cyan-100 hover:bg-cyan-400/15"
        >
          Open observation deck
        </Link>
      </div>
    </div>
  );
}
