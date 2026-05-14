"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Atom, Crosshair, Gauge, Orbit, RadioTower, Waves } from "lucide-react";

import { makeUniverse } from "@/lib/universes";
import { physicsStep } from "@/lib/physics";
import { analyzeUniverse } from "@/lib/analysis";
import { discoverLaws } from "@/lib/discovery";
import { WORLD } from "@/lib/world";
import { symbolicLaw } from "@/lib/symbolic";

import SimulationCanvas from "@/components/SimulationCanvas";
import AtmosphericShell from "@/components/AtmosphericShell";
import ObserverCognition from "@/components/ObserverCognition";
import FieldMinimap from "@/components/FieldMinimap";
import LawDiscovery from "@/components/LawDiscovery";
import MetricsPanel from "@/components/MetricsPanel";
import CommandDock from "@/components/CommandDock";
import CausalGraph from "@/components/CausalGraph";
import LatentSpace from "@/components/LatentSpace";

function fmt(v, d = 2) {
  return Number.isFinite(v) ? v.toFixed(d) : "n/a";
}

export default function ObservationField() {
  const [mode, setMode] = useState("gravity");
  const [gravity, setGravity] = useState(1.2);
  const [entropy, setEntropy] = useState(0.55);
  const [running, setRunning] = useState(true);
  const [predictionMode, setPredictionMode] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [tool, setTool] = useState("perturb");
  const [energyInjection, setEnergyInjection] = useState(1);
  const [bodies, setBodies] = useState(() => makeUniverse("gravity"));
  const [blackHoles, setBlackHoles] = useState([]);
  const [shockwaves, setShockwaves] = useState([]);
  const [history, setHistory] = useState([]);
  const [tick, setTick] = useState(0);
  const tickRef = useRef(0);
  const stageRef = useRef(null);
  const bhPrev = useRef(0);
  const [spacetimeShake, setSpacetimeShake] = useState(false);
  const [parallaxLight, setParallaxLight] = useState(0);
  const [showCausal, setShowCausal] = useState(false);
  const [showLaws, setShowLaws] = useState(true);
  const [metricsOpen, setMetricsOpen] = useState(true);
  const [rebooting, setRebooting] = useState(false);
  const [pointer, setPointer] = useState(null);
  const draggingRef = useRef(false);
  const [forceTrail, setForceTrail] = useState([]);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  useEffect(() => {
    let frame;
    const animate = () => {
      if (running) {
        setBodies((prev) => {
          const next = physicsStep(prev, { gravity, entropy, mode, blackHoles });
          setHistory((prevHistory) => [
            ...prevHistory.slice(-90),
            next.map((b) => ({
              x: b.x,
              y: b.y,
              vx: b.vx,
              vy: b.vy,
            })),
          ]);
          return next;
        });

        setTick((t) => t + 1);
      }

      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [running, gravity, entropy, mode, blackHoles]);

  const analysis = useMemo(
    () => analyzeUniverse(bodies, history),
    [bodies, history],
  );

  const discoveredLaws = discoverLaws(bodies, analysis);
  const sym = symbolicLaw(mode, analysis);

  const trails = useMemo(() => {
    const sampled = history.filter((_, i) => i % 2 === 0);
    return Array.from({ length: Math.min(90, bodies.length) }, (_, idx) =>
      sampled.map((frame) => frame[idx]).filter(Boolean),
    );
  }, [bodies, history]);

  useEffect(() => {
    if (blackHoles.length <= bhPrev.current) {
      bhPrev.current = blackHoles.length;
      return undefined;
    }
    bhPrev.current = blackHoles.length;
    setSpacetimeShake(true);
    const t = window.setTimeout(() => setSpacetimeShake(false), 620);
    return () => window.clearTimeout(t);
  }, [blackHoles.length]);

  const pushWave = useCallback((x, y, kind, intensity = 1) => {
    const born = tickRef.current;
    setShockwaves((w) => [...w, { x, y, born, kind, intensity }].slice(-14));
  }, []);

  const interact = useCallback(
    (e) => {
      const el = stageRef.current;
      if (!el || e.target.closest("[data-command]")) return;

      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * WORLD.W;
      const y = ((e.clientY - rect.top) / rect.height) * WORLD.H;
      setPointer({ x, y });
      draggingRef.current = true;

      if (tool === "blackhole") {
        setBlackHoles((old) => [...old, { x, y, power: 95, radius: 18 }]);
        pushWave(x, y, "singularity", 1.15);
        return;
      }

      pushWave(x, y, "force", 0.35 + energyInjection * 0.45);
      setForceTrail([{ x, y }]);

      setBodies((prev) =>
        prev.map((b) => {
          const dx = b.x - x;
          const dy = b.y - y;
          const d = Math.hypot(dx, dy) + 1;
          const force = Math.max(0, 1 - d / 260) * 4 * energyInjection;
          return {
            ...b,
            vx: b.vx + (dx / d) * force,
            vy: b.vy + (dy / d) * force,
          };
        }),
      );
    },
    [tool, energyInjection, pushWave],
  );

  const onStageMove = useCallback(
    (e) => {
      const el = stageRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setParallaxLight(Math.hypot(nx, ny) * 18);

      const x = ((e.clientX - rect.left) / rect.width) * WORLD.W;
      const y = ((e.clientY - rect.top) / rect.height) * WORLD.H;
      setPointer({ x, y });

      if (!draggingRef.current || tool !== "perturb") return;

      setForceTrail((t) => [...t, { x, y }].slice(-24));
      setBodies((prev) =>
        prev.map((b) => {
          const dx = b.x - x;
          const dy = b.y - y;
          const d = Math.hypot(dx, dy) + 1;
          const force = Math.max(0, 1 - d / 240) * 0.85 * energyInjection;
          return { ...b, vx: b.vx + (dx / d) * force, vy: b.vy + (dy / d) * force };
        }),
      );
    },
    [energyInjection, tool],
  );

  useEffect(() => {
    const up = () => {
      draggingRef.current = false;
      setForceTrail([]);
    };
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  const resetUniverse = useCallback(() => {
    setRebooting(true);
    setHistory([]);
    setBlackHoles([]);
    setShockwaves([]);
    setBodies(makeUniverse(mode));
    window.setTimeout(() => setRebooting(false), 480);
  }, [mode]);

  const setRegime = useCallback((id) => {
    setMode(id);
    setHistory([]);
    setBlackHoles([]);
    setShockwaves([]);
    setBodies(makeUniverse(id));
  }, []);

  const dimensionWarp = mode === "chaos" ? "tilt" : "flat";
  const causalCoupling = analysis.causalCoherence * 0.88 + 0.06;
  const vectorFieldStrength = 0.3 + analysis.order * 0.62;
  const primaryLawTitle = discoveredLaws[0]?.title ?? null;
  const activeToolLabel = tool === "blackhole" ? "Singularity placement" : "Force injection";

  return (
    <div className="relative min-h-[calc(100dvh-3.5rem)] overflow-hidden bg-[#02030a] text-white">
      <AtmosphericShell parallax={parallaxLight} />

      <div className="relative z-[1] mx-auto flex max-w-[1800px] flex-col gap-4 px-3 pb-10 pt-4 sm:px-6 lg:pt-6">
        <section className="relative overflow-hidden rounded-lg border border-white/[0.08] bg-black/35 px-4 py-4 shadow-[0_28px_120px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:px-5">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(103,232,249,0.08),transparent_28%,rgba(240,171,252,0.06)_68%,transparent)]" />
          <div className="relative flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] font-light uppercase tracking-[0.34em] text-cyan-100/55">
                <RadioTower className="h-3.5 w-3.5 tracking-normal text-cyan-200/70" aria-hidden />
                cinematic observation deck
              </div>
              <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl font-light leading-none text-white sm:text-5xl lg:text-6xl">
                Observe the synthetic universe
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/55">
                <span className="inline-flex items-center gap-2 rounded-md border border-cyan-200/15 bg-cyan-200/[0.06] px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs text-cyan-100/80">
                  <Activity className="h-3.5 w-3.5" aria-hidden />
                  {running ? "live simulation" : "time paused"}
                </span>
                <code className="rounded-md border border-white/10 bg-black/35 px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs text-cyan-200/80">
                  {sym.equation}
                </code>
                <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/35 px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs text-white/58">
                  <Crosshair className="h-3.5 w-3.5" aria-hidden />
                  {activeToolLabel}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2" data-command aria-label="Universe regimes">
              {[
                { id: "gravity", label: "Gravity", Ico: Orbit },
                { id: "chaos", label: "Chaos", Ico: Waves },
                { id: "swarm", label: "Swarm", Ico: Atom },
              ].map(({ id, label, Ico }) => (
                <button
                  key={id}
                  type="button"
                  data-command
                  aria-pressed={mode === id}
                  onClick={() => setRegime(id)}
                  className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/60 ${
                    mode === id
                      ? "border-cyan-300/45 bg-cyan-300/12 text-white shadow-[0_0_35px_rgba(103,232,249,0.12)]"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06]"
                  }`}
                >
                  <Ico className="h-3.5 w-3.5 opacity-80" aria-hidden />
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 font-[family-name:var(--font-mono)] text-[10px] font-light uppercase tracking-[0.16em] text-white/45 sm:grid-cols-4 xl:min-w-[440px]">
              {[
                ["Sigma", fmt(analysis.compressibility), "text-cyan-100/85"],
                ["Entropy", fmt(analysis.entropy), "text-fuchsia-100/85"],
                ["Error", fmt(analysis.predictionError), "text-orange-100/85"],
                ["Lambda", fmt(analysis.horizonCollapse), "text-rose-100/85"],
              ].map(([label, value, tone]) => (
                <div key={label} className="rounded-lg border border-white/[0.07] bg-black/35 px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <Gauge className="h-3 w-3 tracking-normal text-white/35" aria-hidden />
                    {label}
                  </div>
                  <div className={`mt-1 text-base tracking-normal ${tone}`}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid min-h-[min(76vh,860px)] grid-cols-1 gap-4 lg:grid-cols-[340px_minmax(0,1fr)_360px] xl:grid-cols-[380px_minmax(0,1fr)_380px]">
          <aside className="order-2 rounded-lg border border-white/[0.08] bg-black/35 backdrop-blur-xl lg:order-1">
            <div className="border-b border-white/[0.06] px-4 py-3">
              <div className="font-[family-name:var(--font-syne)] text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                Observer cognition
              </div>
              <div className="mt-1 font-[family-name:var(--font-mono)] text-[10px] font-light uppercase tracking-[0.28em] text-white/40">
                live inference stream
              </div>
            </div>
            <div className="max-h-[62vh] overflow-auto px-4 py-3">
              <ObserverCognition tick={tick} mode={mode} analysis={analysis} primaryLawTitle={primaryLawTitle} />
            </div>
          </aside>

          <section
            className={`obs-stage-frame relative isolate order-1 min-h-[58vh] overflow-hidden rounded-lg border border-white/[0.08] bg-black/25 backdrop-blur-xl lg:order-2 ${
              spacetimeShake ? "obs-shake" : ""
            }`}
          >
            <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center justify-between border-b border-white/[0.05] bg-black/20 px-4 py-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.24em] text-white/38 backdrop-blur-md">
              <span>field viewport</span>
              <span>{mode} / {bodies.length} bodies</span>
            </div>
            {rebooting && (
              <div className="pointer-events-none absolute inset-0 z-40">
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(103,232,249,0.20),transparent_55%)]" />
              </div>
            )}
            <div
              ref={stageRef}
              className="absolute inset-0 touch-none [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
              onPointerMove={onStageMove}
              onPointerDown={interact}
              role="application"
              aria-label="Observation canvas"
            >
              <SimulationCanvas
                bodies={bodies}
                trails={trails}
                analysis={analysis}
                scanning={scanning}
                mode={mode}
                simTick={tick}
                dimensionWarp={dimensionWarp}
                causalCoupling={causalCoupling}
                vectorFieldStrength={vectorFieldStrength}
                blackHoles={blackHoles}
                shockwaves={shockwaves}
                predictionMode={predictionMode}
                pointer={pointer}
                forceTrail={forceTrail}
              />
            </div>
          </section>

          <aside className="order-3 rounded-lg border border-white/[0.08] bg-black/35 backdrop-blur-xl">
            <div className="border-b border-white/[0.06] px-4 py-3">
              <div className="font-[family-name:var(--font-syne)] text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                Instrument panel
              </div>
              <div className="mt-1 font-[family-name:var(--font-mono)] text-[10px] font-light uppercase tracking-[0.28em] text-white/40">
                metrics laws parameters
              </div>
            </div>

            <div className="space-y-4 p-4">
              <MetricsPanel analysis={analysis} open={metricsOpen} setOpen={setMetricsOpen} />
              <FieldMinimap bodies={bodies} blackHoles={blackHoles} analysis={analysis} />

              <AnimatePresence initial={false}>
                {showLaws && (
                  <motion.div
                    key="laws"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <LawDiscovery laws={discoveredLaws} compact />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence initial={false}>
                {showCausal && (
                  <motion.div
                    key="causal"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <CausalGraph bodies={bodies} />
                    <LatentSpace
                      universes={[
                        { x: 160, y: 120, size: 8, color: "#67e8f9", label: "stable gravity" },
                        { x: 420, y: 240, size: 10, color: "#f0abfc", label: "chaotic field" },
                        { x: 320, y: 150, size: 7, color: "#a78bfa", label: "swarm order" },
                        { x: 620, y: 100, size: 9, color: "#fb923c", label: "high entropy" },
                      ]}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="rounded-lg border border-white/[0.08] bg-black/30 p-4">
                <div className="font-[family-name:var(--font-mono)] text-[10px] font-light uppercase tracking-[0.34em] text-white/45">
                  Parameters
                </div>
                <div className="mt-4 space-y-4">
                  <label className="block">
                    <div className="flex items-center justify-between text-[11px] text-white/60">
                      <span>Gravity</span>
                      <span className="font-mono text-cyan-200/70">{fmt(gravity)}</span>
                    </div>
                    <input
                      type="range"
                      min={0.3}
                      max={2}
                      step={0.01}
                      value={gravity}
                      onChange={(e) => setGravity(Number(e.target.value))}
                      className="mt-2 w-full"
                    />
                  </label>
                  <label className="block">
                    <div className="flex items-center justify-between text-[11px] text-white/60">
                      <span>Entropy</span>
                      <span className="font-mono text-fuchsia-200/70">{fmt(entropy)}</span>
                    </div>
                    <input
                      type="range"
                      min={0.05}
                      max={1.3}
                      step={0.01}
                      value={entropy}
                      onChange={(e) => setEntropy(Number(e.target.value))}
                      className="mt-2 w-full"
                    />
                  </label>
                  <label className="block">
                    <div className="flex items-center justify-between text-[11px] text-white/60">
                      <span>Injection</span>
                      <span className="font-mono text-violet-200/70">{fmt(energyInjection)}</span>
                    </div>
                    <input
                      type="range"
                      min={0.2}
                      max={2}
                      step={0.05}
                      value={energyInjection}
                      onChange={(e) => setEnergyInjection(Number(e.target.value))}
                      className="mt-2 w-full"
                    />
                  </label>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <CommandDock
          tool={tool}
          setTool={setTool}
          predictionMode={predictionMode}
          setPredictionMode={setPredictionMode}
          running={running}
          setRunning={setRunning}
          scanning={scanning}
          setScanning={setScanning}
          onReset={resetUniverse}
          onEntropyUp={() => setEntropy((e) => Math.min(1.3, e + 0.08))}
          onStabilize={() => {
            setEntropy((e) => Math.max(0.05, e - 0.12));
            setEnergyInjection(1);
          }}
          showCausal={showCausal}
          setShowCausal={setShowCausal}
          showLaws={showLaws}
          setShowLaws={setShowLaws}
        />
      </div>
    </div>
  );
}
