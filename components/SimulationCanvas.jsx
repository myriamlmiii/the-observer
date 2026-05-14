"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { causalGraphEdges } from "@/lib/analysis";
import { WORLD } from "@/lib/world";

const { W: RW, H: RH } = WORLD;

function warpPoint(x, y, warpMode, k) {
  if (warpMode === "tilt") {
    const u = x / RW - 0.5;
    return { x: x + u * 26 * k, y: y - u * 14 * k };
  }

  const u = Math.sin(y * 0.004);
  return { x: x + u * 12 * k, y };
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

export default function SimulationCanvas({
  bodies,
  trails,
  analysis,
  scanning,
  mode,
  simTick = 0,
  causalCoupling = 0.4,
  vectorFieldStrength = 0.55,
  dimensionWarp = "flat",
  blackHoles = [],
  shockwaves = [],
  predictionMode = false,
  pointer = null,
  forceTrail = [],
  probes = [],
  selectedId,
  dragTargetId,
  vacuumPlacementActive = false,
  onVacuumPointerDown,
  interactionEnabled = false,
  onGrabBody,
  onSvgRef,
}) {
  const grid = useMemo(() => Array.from({ length: 26 }, (_, i) => i), []);

  const stars = useMemo(
    () =>
      Array.from({ length: 380 }, (_, i) => ({
        id: i,
        x: (i * 193) % RW,
        y: (i * 311) % RH,
        r: 0.35 + ((i * 47) % 10) / 14,
        o: 0.06 + ((i * 73) % 18) / 120,
      })),
    [],
  );

  const nebulaSeeds = useMemo(
    () => [
      { cx: RW * 0.22, cy: RH * 0.31, rx: RW * 0.38, ry: RH * 0.22, hue: "#4c1d95", op: 0.14 },
      { cx: RW * 0.78, cy: RH * 0.64, rx: RW * 0.32, ry: RH * 0.28, hue: "#0e7490", op: 0.11 },
      { cx: RW * 0.52, cy: RH * 0.18, rx: RW * 0.28, ry: RH * 0.18, hue: "#9d174d", op: 0.09 },
    ],
    [],
  );

  const edges = useMemo(
    () => causalGraphEdges(bodies, mode === "chaos" ? 190 : 220, 0.45 + causalCoupling * 0.82),
    [bodies, causalCoupling, mode],
  );

  const ripple = Math.max(0, analysis.entropy - 0.45) + analysis.horizonCollapse * 0.6;

  const entropyHeatmap = useMemo(() => {
    const cols = 26;
    const rows = 16;
    const cw = RW / cols;
    const ch = RH / rows;
    const cells = [];

    for (let yi = 0; yi < rows; yi++) {
      for (let xi = 0; xi < cols; xi++) {
        let load = 0;
        const ccx = xi * cw + cw / 2;
        const ccy = yi * ch + ch / 2;

        for (const b of bodies) {
          const d = Math.hypot(b.x - ccx, b.y - ccy) + 22;
          const speed = Math.hypot(b.vx, b.vy);
          load += ((speed + 1) * (b.mass || 8)) / (d * d * 0.00052 + 400);
        }

        cells.push({
          key: `${xi}-${yi}`,
          xi,
          yi,
          opacity: clamp01(load / (mode === "chaos" ? 420 : 360)) * (0.12 + analysis.entropy * 0.32),
          fillHue: analysis.entropy > 0.55 ? "#fda4af" : "#67e8f9",
        });
      }
    }
    return cells;
  }, [bodies, analysis.entropy, mode]);

  const vf = useMemo(() => {
    const field = [];
    const step = Math.max(64, Math.floor(540 * (1.08 - vectorFieldStrength * 0.38)));
    const scale = 240 * vectorFieldStrength;

    for (let gx = step; gx < RW - step; gx += step) {
      for (let gy = step; gy < RH - step; gy += step) {
        let fx = 0;
        let fy = 0;

        for (const b of bodies) {
          const dx = b.x - gx;
          const dy = b.y - gy;
          const d2 = dx * dx + dy * dy + 4000;
          const inv = 980 * b.mass * 0.000024;
          fx += (inv * dx) / d2;
          fy += (inv * dy) / d2;
        }

        for (const h of blackHoles) {
          const dx = h.x - gx;
          const dy = h.y - gy;
          const d2 = dx * dx + dy * dy + 520;
          const inv = (h.power || 90) * 0.012;
          fx += (inv * dx) / d2;
          fy += (inv * dy) / d2;
        }

        const w0 = warpPoint(gx, gy, dimensionWarp, 1);
        const w1 = warpPoint(gx + fx * scale, gy + fy * scale, dimensionWarp, 1);
        field.push({ x1: w0.x, y1: w0.y, x2: w1.x, y2: w1.y });
      }
    }

    return field.slice(0, 88);
  }, [bodies, blackHoles, vectorFieldStrength, dimensionWarp]);

  function project(b) {
    return warpPoint(b.x, b.y, dimensionWarp, mode === "chaos" ? 1 : 0.58);
  }

  const pointerWarp = pointer ? warpPoint(pointer.x, pointer.y, dimensionWarp, 0.58) : null;

  return (
    <svg
      ref={onSvgRef}
      viewBox={`0 0 ${RW} ${RH}`}
      className="h-full w-full select-none touch-none"
      preserveAspectRatio="xMidYMid slice"
      style={{
        filter:
          ripple > 0.32
            ? `contrast(${1 + ripple * 0.08}) saturate(${1 + ripple * 0.05}) brightness(${1.02 + ripple * 0.03})`
            : undefined,
      }}
    >
      <defs>
        <radialGradient id="obsCoreGlow" cx="50%" cy="42%" r="72%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
          <stop offset="48%" stopColor="#7c3aed" stopOpacity="0.09" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="trailGradientObs" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
          <stop offset="42%" stopColor="#a78bfa" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#f0abfc" stopOpacity="0.94" />
        </linearGradient>

        <radialGradient id="bhLens" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#020617" stopOpacity="0.94" />
          <stop offset="55%" stopColor="#1e1b4b" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>

        <filter id="glowObs">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="bloomRipple">
          <feGaussianBlur stdDeviation={2.2 + ripple * 7} result="blur" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.54 0" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width={RW} height={RH} fill="url(#obsCoreGlow)" />

      <rect width={RW} height={RH} fill="#030712" opacity="0.9" />

      {stars.map((s) => (
        <circle key={s.id} cx={s.x} cy={s.y} r={s.r} fill="#f8fafc" opacity={s.o} />
      ))}

      {nebulaSeeds.map((n, i) => (
        <motion.ellipse
          key={n.hue}
          cx={n.cx}
          cy={n.cy}
          rx={n.rx}
          ry={n.ry}
          fill={n.hue}
          opacity={n.op}
          animate={{
            cx: [n.cx, n.cx + 12 * Math.sin(i * 1.1), n.cx],
            cy: [n.cy, n.cy + 8 * Math.cos(i * 0.9), n.cy],
            rx: [n.rx * 0.94, n.rx * 1.06, n.rx * 0.94],
            opacity: [n.op * 0.7, n.op * 1.15, n.op * 0.7],
          }}
          transition={{ duration: 18 + i * 4, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {pointerWarp && (
        <g pointerEvents="none">
          <circle
            cx={pointerWarp.x}
            cy={pointerWarp.y}
            r={120}
            fill="#67e8f9"
            opacity={0.06}
            style={{ mixBlendMode: "screen" }}
          />
          <circle
            cx={pointerWarp.x}
            cy={pointerWarp.y}
            r={48}
            fill="#f0abfc"
            opacity={0.06}
            style={{ mixBlendMode: "screen" }}
          />
        </g>
      )}

      {forceTrail.length >= 2 && (
        <g pointerEvents="none" filter="url(#glowObs)">
          <path
            d={forceTrail
              .map((p, i) => {
                const w = warpPoint(p.x, p.y, dimensionWarp, 0.58);
                return `${i === 0 ? "M" : "L"}${w.x},${w.y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#67e8f9"
            strokeOpacity={0.35}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ mixBlendMode: "screen" }}
          />
        </g>
      )}

      <rect width={RW} height={RH} fill={`url(#obsCoreGlow)`} opacity={0.04 + analysis.attractorProximity * 0.05} />

      <g opacity={0.065 + analysis.compressibility * 0.035} pointerEvents="none">
        {entropyHeatmap.map((c) => {
          const cw = RW / 26;
          const ch = RH / 16;
          const x = c.xi * cw;
          const y = c.yi * ch;

          return (
            <rect
              key={c.key}
              x={x}
              y={y}
              width={cw + 1}
              height={ch + 1}
              fill={c.fillHue}
              opacity={c.opacity * (0.4 + analysis.causalCoherence * 0.5)}
              style={{ mixBlendMode: "screen" }}
            />
          );
        })}
      </g>

      {grid.map((i) => {
        const k = dimensionWarp !== "flat" ? 0.32 + i * 0.01 : 0.18 + ripple * 0.02;
        const x = (i / (grid.length - 1 || 1)) * RW;
        const y = (i / (grid.length - 1 || 1)) * RH;

        const pTop = warpPoint(x, 0, dimensionWarp, k);
        const pBot = warpPoint(x, RH, dimensionWarp, k);
        const pLeft = warpPoint(0, y, dimensionWarp, k);
        const pRight = warpPoint(RW, y, dimensionWarp, k);

        return (
          <g key={i} opacity={0.034 + ripple * 0.028 + analysis.compressibility * 0.022}>
            <line x1={pTop.x} y1={pTop.y} x2={pBot.x} y2={pBot.y} stroke="#5eead4" strokeWidth={0.6} />
            <line x1={pLeft.x} y1={pLeft.y} x2={pRight.x} y2={pRight.y} stroke="#c4b5fd" strokeWidth={0.55} />
          </g>
        );
      })}

      {ripple > 0.16 && (
        <rect
          width={RW}
          height={RH}
          fill="url(#obsCoreGlow)"
          opacity={0.05 + ripple * 0.07}
          style={{ pointerEvents: "none" }}
        />
      )}

      <ellipse
        cx={RW / 2}
        cy={RH / 2}
        rx={78 + analysis.order * 220}
        ry={74 + analysis.attractorProximity * 195}
        fill="none"
        stroke="#22d3ee"
        strokeOpacity={0.085 + analysis.order * 0.13}
        strokeWidth={1}
        strokeDasharray="10 22"
      />

      <ellipse
        cx={RW / 2}
        cy={RH / 2}
        rx={46 + analysis.compressibility * 260}
        ry={52 + analysis.causalCoherence * 218}
        fill="none"
        stroke="#d946ef"
        strokeOpacity={0.06 + analysis.compressibility * 0.13}
        strokeWidth={1.1}
        strokeDasharray="4 17"
      />

      <ellipse
        cx={RW / 2}
        cy={RH / 2}
        rx={120 + analysis.entropy * 210}
        ry={126 + analysis.entropy * 198}
        fill="none"
        stroke="#fb7185"
        strokeOpacity={0.05 + analysis.entropy * 0.12 + analysis.horizonCollapse * 0.14}
        strokeWidth={ripple > 0.45 ? 1.8 + ripple * 0.4 : 1.2}
      />

      {mode === "gravity" &&
        [160, 220, 284, 340, 400].map((r) => (
          <motion.circle
            key={r}
            cx={RW / 2}
            cy={RH / 2}
            r={r}
            fill="none"
            stroke="#38bdf8"
            strokeOpacity={0.04 + analysis.causalCoherence * 0.04}
            strokeDasharray={`${6 + (r % 42) / 18} ${16}`}
            animate={{ strokeDashoffset: [0, -220] }}
            transition={{ duration: 90 + r * 0.4, repeat: Infinity, ease: "linear" }}
          />
        ))}

      {vf.map((f, i) => (
        <line
          key={i}
          x1={f.x1}
          y1={f.y1}
          x2={f.x2}
          y2={f.y2}
          stroke="#5eead4"
          strokeOpacity={0.04 + vectorFieldStrength * 0.12}
          strokeWidth={0.9}
          style={{ mixBlendMode: "screen" }}
        />
      ))}

      {edges.map((e, i) => {
        const p1 = warpPoint(e.a.x, e.a.y, dimensionWarp, 0.52);
        const p2 = warpPoint(e.b.x, e.b.y, dimensionWarp, 0.52);
        const w = 0.55 + causalCoupling;

        return (
          <line
            key={i}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="#818cf8"
            strokeOpacity={e.weight * (0.05 + (1 - Math.min(e.d, 210) / 210) * 0.35) * w}
            strokeWidth={1.05}
            style={{ mixBlendMode: "screen" }}
          />
        );
      })}

      {shockwaves.map((s, i) => {
        const age = simTick - (s.born ?? 0);
        if (age < 0 || age > 150) return null;
        const w = warpPoint(s.x, s.y, dimensionWarp, 0.5);
        const r = s.kind === "singularity" ? 28 + age * 7.8 : 12 + age * 6;
        const op = (s.intensity ?? 1) * (1 - age / 150);

        return (
          <ellipse
            key={`${w.x}-${w.y}-${i}-${s.born}`}
            cx={w.x}
            cy={w.y}
            rx={r}
            ry={s.kind === "singularity" ? r * (0.86 + ripple * 0.05) : r * 0.93}
            fill="none"
            stroke={s.kind === "singularity" ? "#fb7185" : "#67e8f9"}
            strokeWidth={s.kind === "singularity" ? 2 + op : 1.3 + op * 0.4}
            strokeOpacity={0.52 * op}
            pointerEvents="none"
            transform={`rotate(${age * 1.8} ${w.x} ${w.y})`}
          />
        );
      })}

      {predictionMode &&
        bodies.slice(0, 52).map((b, idx) => {
          if (!b?.vx && !b?.vy) return null;

          const w = project(b);
          const sp = Math.hypot(b.vx, b.vy) + 0.012;
          const ux = b.vx / sp;
          const uy = b.vy / sp;
          const L = 34 + analysis.compressibility * 110;
          const span = Math.PI / 9 + analysis.entropy * 0.06;
          const cos = Math.cos;
          const sin = Math.sin;

          const a1 = Math.atan2(uy, ux) + span * 2;
          const a2 = Math.atan2(uy, ux) - span * 2;
          const p1 = project({ x: b.x + cos(a1) * 10, y: b.y + sin(a1) * 10 });
          const apex = warpPoint(b.x + ux * L, b.y + uy * L, dimensionWarp, mode === "chaos" ? 1 : 0.58);
          const p2 = project({ x: b.x + cos(a2) * 10, y: b.y + sin(a2) * 10 });

          return (
            <path
              key={`cone-${idx}-${String(b.id)}`}
              d={`M ${w.x},${w.y} L ${p1.x},${p1.y} L ${apex.x},${apex.y} L ${p2.x},${p2.y} Z`}
              fill="url(#obsCoreGlow)"
              fillOpacity={0.08 + analysis.causalCoherence * 0.04}
              stroke="#c4b5fd"
              strokeOpacity={0.16}
              strokeWidth={0.6}
              style={{ pointerEvents: "none" }}
            />
          );
        })}

      {blackHoles.map((h, i) => {
        const w = warpPoint(h.x, h.y, dimensionWarp, 0.55);

        const R = Math.max(h.radius || 14, 8);

        return (
          <g key={`bh-${i}`} pointerEvents="none" filter={ripple > 0.52 ? "url(#glowObs)" : undefined}>
            <circle cx={w.x} cy={w.y} r={R * 6.2} fill="url(#bhLens)" opacity={0.6} />

            {[1, 1.85, 2.95, 4.25].map((m, ri) => (
              <motion.circle
                key={ri}
                cx={w.x}
                cy={w.y}
                r={R * m * (0.94 + ripple * 0.015)}
                fill="none"
                stroke={ri % 2 === 0 ? "#fda4af" : "#67e8f9"}
                strokeOpacity={0.14 + (1 / m) * 0.1}
                strokeWidth={2.2 / m}
                strokeDasharray={`${10 + ri * 4} ${18 + ri * 3}`}
                animate={{
                  rotate: ri % 2 === 0 ? 360 : -360,
                  strokeDashoffset: [0, -(60 + ri * 12)],
                }}
                transition={{ duration: 14 + ri * 5, repeat: Infinity, ease: "linear", delay: ri * 0.2 }}
                style={{ transformOrigin: `${w.x}px ${w.y}px` }}
              />
            ))}
            <circle cx={w.x} cy={w.y} r={R * 1.08} fill="#020617" stroke="#fbcfe8" strokeOpacity={0.5} strokeWidth={1} />
          </g>
        );
      })}

      {trails.map((trail, idx) => {
        if (trail.length < 3) return null;
        let d = "";
        trail.forEach((p, ti) => {
          const pw = warpPoint(p.x, p.y, dimensionWarp, 0.45);
          d += `${ti === 0 ? "M" : "L"}${pw.x},${pw.y}`;
        });

        return (
          <motion.path
            key={idx}
            d={d}
            fill="none"
            stroke="url(#trailGradientObs)"
            strokeWidth={1.35}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.32 + analysis.compressibility * 0.12 }}
          />
        );
      })}

      {probes.map((p, idx) => {
        const w = warpPoint(p.x, p.y, dimensionWarp, 0.4);

        return (
          <g key={`probe-${idx}`} filter="url(#glowObs)">
            <circle cx={w.x} cy={w.y} r={14} stroke="#fb923c" strokeOpacity={0.4} fill="none" />
            <circle cx={w.x} cy={w.y} r={5} fill="#fb923c" />
          </g>
        );
      })}

      {bodies.map((b, idx) => {
        const w = project(b);

        const fill =
          b.type === "star"
            ? "#fef3c7"
            : b.type === "singularity"
            ? "#0f172a"
            : idx % 4 === 0
            ? "#f0abfc"
            : idx % 4 === 1
            ? "#67e8f9"
            : idx % 4 === 2
            ? "#c4b5fd"
            : "#bae6fd";

        const halo = selectedId === b.id || dragTargetId === b.id ? 1.12 : 1;
        const br = b.r || 2.8;
        const prox =
          pointerWarp && b.type !== "singularity"
            ? clamp01(1 - Math.hypot(w.x - pointerWarp.x, w.y - pointerWarp.y) / 220)
            : 0;

        return (
          <g key={String(b.id)} filter="url(#glowObs)" data-body-id={b.id}>
            <circle cx={w.x} cy={w.y} r={br * (b.type === "star" ? 8.8 : 5.6) * halo} fill="#fde68a" opacity={b.type === "star" ? 0.09 : 0.06} />
            <motion.circle
              cx={w.x}
              cy={w.y}
              r={br * (b.type === "star" ? 5.8 : 3.85) * halo}
              fill={fill}
              fillOpacity={0.1 + prox * 0.18}
              animate={{ opacity: [0.05, 0.18, 0.05], r: [br * 3.9, br * 4.6, br * 3.9] }}
              transition={{
                duration: b.type === "star" ? 4.8 : 2.6 + (idx % 7) * 0.06,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ pointerEvents: "none" }}
            />

            <circle
              cx={w.x}
              cy={w.y}
              r={br * 3.35}
              stroke="#ffffff"
              opacity={selectedId === b.id ? 0.14 : b.type === "star" ? 0.07 : 0.03}
              fill="none"
            />

            <circle
              cx={w.x}
              cy={w.y}
              r={b.type === "singularity" ? (b.r || 14) + 4 : br}
              fill={b.type === "singularity" ? "#020617" : fill}
              stroke={
                dragTargetId === b.id ? "#ffffff" : b.type === "singularity" ? "#fb7185" : fill === "#fef3c7" ? "#fcd34d" : "transparent"
              }
              strokeWidth={dragTargetId === b.id ? 1.8 : b.type === "singularity" ? 1 : b.type === "star" ? 0.85 : 0}
              style={{
                cursor:
                  interactionEnabled && !b.fixed && b.type !== "singularity"
                    ? dragTargetId === b.id
                      ? "grabbing"
                      : "grab"
                    : "crosshair",
                filter: fill === "#fef3c7" ? "drop-shadow(0 0 8px rgba(253,224,71,0.5))" : undefined,
              }}
              pointerEvents={interactionEnabled && !b.fixed && b.type !== "singularity" ? "auto" : "none"}
              onPointerDown={(event) => {
                if (
                  interactionEnabled &&
                  !b.fixed &&
                  b.type !== "singularity" &&
                  typeof onGrabBody === "function"
                ) {
                  event.preventDefault();
                  event.stopPropagation();
                  onGrabBody(event, String(b.id));
                }
              }}
            />

            {(b.type === "particle" || !b.type) && (
              <motion.line
                x1={w.x}
                y1={w.y}
                x2={w.x + b.vx * 14}
                y2={w.y + b.vy * 14}
                stroke="#a5f3fc"
                strokeOpacity={predictionMode ? 0.52 : 0.18}
                strokeWidth={predictionMode ? 1.05 : 0.65}
              />
            )}
          </g>
        );
      })}

      {scanning && (
        <g pointerEvents="none" filter={ripple > 0.45 ? "url(#bloomRipple)" : "url(#glowObs)"}>
          <motion.line
            x1="0"
            x2={RW}
            y1="0"
            y2="0"
            stroke="#67e8f9"
            strokeWidth={2.2}
            strokeOpacity={0.44}
            animate={{ y1: [0, RH, 0], y2: [0, RH, 0] }}
            transition={{ duration: ripple > 0.52 ? 2.6 : 4.1, repeat: Infinity, ease: "linear" }}
          />

          <motion.circle
            cx={RW / 2}
            cy={RH / 2}
            r="94"
            fill="none"
            stroke="#f0abfc"
            strokeWidth={1.65}
            strokeOpacity={0.38}
            animate={{
              r: [88, ripple > 0.52 ? 320 : 290, 88],
              opacity: [0.08, 0.55, 0.08],
            }}
            transition={{ duration: ripple > 0.52 ? 2.1 : 2.95, repeat: Infinity }}
          />
        </g>
      )}

      {vacuumPlacementActive && typeof onVacuumPointerDown === "function" && (
        <rect width={RW} height={RH} fill="transparent" style={{ cursor: "crosshair" }} onPointerDown={(event) => {
          event.stopPropagation();
          onVacuumPointerDown(event);
        }} />
      )}
    </svg>
  );
}
