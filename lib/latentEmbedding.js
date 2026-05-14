/** Deterministic 2-D embedding positions from physics state + diagnostics (pseudo-manifold). */
export function latentCloudPoints(analysis, mode, rng, count = 40) {
  const base =
    mode === "gravity"
      ? [112, 48]
      : mode === "chaos"
      ? [168, 128]
      : mode === "swarm"
      ? [132, 86]
      : [188, 150];

  const out = [];

  for (let i = 0; i < count; i++) {
    const t = i / Math.max(1, count - 1);
    const swirl = Math.sin(t * Math.PI * 2 + analysis.entropy * 4);

    const x =
      base[0] +
      swirl * 28 -
      analysis.horizonCollapse * 52 +
      analysis.compressibility * 34 +
      (rng() - 0.5) * 8;

    const y =
      base[1] +
      Math.cos(t * 4.7 + analysis.divergence * 8) * 22 +
      (1 - analysis.causalCoherence) * 40 +
      (rng() - 0.5) * 8;

    out.push({ x, y, i });
  }

  return out;
}
