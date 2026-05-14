import { WORLD } from "./world";
import { shannonEntropy } from "./entropy";

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

/** Lightweight causal edges for visualization (cap for performance). */
export function causalGraphEdges(bodies, maxDist = 200, coupling = 0.85) {
  const edges = [];
  const n = bodies.length;
  const cap = Math.min(n, 90);

  for (let i = 0; i < cap; i++) {
    for (let j = i + 1; j < cap; j++) {
      const a = bodies[i];
      const b = bodies[j];
      if (!a || !b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy);
      if (d >= maxDist) continue;

      edges.push({
        a,
        b,
        d,
        weight: coupling * Math.pow(1 - d / maxDist, 1.4),
      });
    }
  }

  edges.sort((u, v) => v.weight - u.weight);
  return edges.slice(0, 120);
}

export function analyzeUniverse(bodies, history) {
  const speeds = bodies.map((b) => Math.hypot(b.vx, b.vy));
  const entropy = shannonEntropy(speeds, 24);

  const kinetic = bodies.reduce((s, b) => s + 0.5 * b.mass * (b.vx ** 2 + b.vy ** 2), 0);

  const cx = bodies.reduce((s, b) => s + b.x, 0) / bodies.length;
  const cy = bodies.reduce((s, b) => s + b.y, 0) / bodies.length;

  const spread = Math.sqrt(
    bodies.reduce((s, b) => s + (b.x - cx) ** 2 + (b.y - cy) ** 2, 0) / bodies.length,
  );

  let predictionError = 1;
  let divergence = 0;

  if (history.length > 8) {
    const prev = history[history.length - 6];
    const old = history[history.length - 8];

    predictionError =
      bodies.reduce((acc, b, i) => {
        const p = prev[i];
        if (!p) return acc;
        const px = p.x + p.vx * 6;
        const py = p.y + p.vy * 6;
        return acc + Math.hypot(px - b.x, py - b.y);
      }, 0) / bodies.length;

    divergence =
      bodies.reduce((acc, b, i) => {
        const o = old[i];
        if (!o) return acc;
        return acc + Math.hypot(b.x - o.x, b.y - o.y);
      }, 0) / bodies.length;
  }

  const order = clamp(1 - spread / 520, 0, 1);
  const compressibility = clamp(1 - entropy * 0.6 - predictionError * 0.004 + order * 0.35, 0, 1);
  const confidence = clamp(compressibility * 100, 0, 99);
  const chaos = clamp(divergence / 240, 0, 1);

  const horizonCollapse = clamp(predictionError / 72 + chaos * 0.42 + (1 - order) * 0.28, 0, 1);
  const causalCoherence = clamp(0.52 + order * 0.35 + compressibility * 0.28 - entropy * 0.45 - chaos * 0.22, 0, 1);

  let attractorProximity = clamp(1 - spread / (WORLD.W * 0.45), 0, 1);
  const attractors = bodies.filter((b) => b.fixed && b.type === "star");
  if (attractors.length > 0) {
    const a = attractors[0];
    const comDist = Math.hypot(cx - a.x, cy - a.y);
    attractorProximity = clamp(1 - comDist / 420 + attractorProximity * 0.25, 0, 1);
  }

  return {
    entropy,
    kinetic,
    spread,
    predictionError,
    divergence,
    order,
    compressibility,
    confidence,
    chaos,
    horizonCollapse,
    attractorProximity,
    causalCoherence,
  };
}
