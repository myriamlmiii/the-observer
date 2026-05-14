import { symbolicLaw } from "./symbolic";

const PHILOSOPHY = [
  "the map is not the territory — only the residual compressibility is real",
  "consciousness may be the universe pricing its own prediction error",
  "if invariants vanish, laws become mere curve-fitting ghosts",
  "measurement is negotiation between noise and narrative",
  "what cannot be predicted cannot be named — only survived",
];

const TELEMETRY = [
  "causal coherence increasing",
  "prediction horizon collapsing",
  "stable invariant detected",
  "compression threshold exceeded",
  "observer confidence destabilizing",
  "latent symmetries amplifying in trajectory space",
  "postterior mass fragmenting across competing models",
  "equivalence classes merging under coarse observation",
  "chaotic modes feeding back into field curvature",
  "information velocity approaching local bound",
  "entropy flux non-stationary — re-weighting hypotheses",
  "crossing separatrix — attractor basin uncertain",
  "gravitational inference dominating pairwise likelihood",
  "symbolic depth penalty rising — prefer shorter laws",
  "trajectory bundle diverging — horizon marker advanced",
];

export function nextObserverLines(tick, mode, analysis, lawSummary) {
  const sym = symbolicLaw(mode, analysis);
  const lines = [];

  const te = TELEMETRY[(tick + tick * 3) % TELEMETRY.length];
  const ph = PHILOSOPHY[Math.floor(tick / 180) % PHILOSOPHY.length];

  if (analysis.causalCoherence > 0.62) lines.push("causal coherence increasing");
  else if (analysis.horizonCollapse > 0.55) lines.push("prediction horizon collapsing");
  else lines.push(te);

  if (analysis.compressibility > 0.68 && analysis.entropy < 0.58) lines.push("stable invariant detected");
  if (analysis.compressibility < 0.32) lines.push("compression threshold exceeded");
  if (analysis.confidence < 38 || analysis.horizonCollapse > 0.48) {
    lines.push("observer confidence destabilizing");
  }

  const unc = (100 - analysis.confidence).toFixed(0);
  lines.push(`uncertainty mass ≈ ${unc}% · horizon λ ${analysis.horizonCollapse.toFixed(2)}`);

  lines.push(`active theory prior → ${sym.equation}  ·  fit ${(sym.confidence * 100).toFixed(0)}%`);

  if (lawSummary) lines.push(lawSummary);

  lines.push(ph);

  return lines.slice(0, 4);
}
