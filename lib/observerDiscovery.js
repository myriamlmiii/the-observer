import { symbolicLaw } from "./symbolic";

const CATALOG = [
  "candidate law under review — complexity vs fit tradeoff tightening",
  "prediction horizon collapsing under sensitivity growth",
  "no low-complexity invariant surviving cross-validation horizon",
  "causal coherence increasing — pairwise constraints agree with trajectories",
  "observer uncertainty rising — posterior mass spreading",
  "compressibility threshold exceeded — symbolic search forced to branch",
  "phase boundary proximity — entropy injection destabilizes model headroom",
  "stable invariant detected within cross-horizon validation window",
  "observer confidence destabilizing — measurement kernel widening",
  "compression threshold exceeded — description length penalty invoked",
];

export function pickDiscoveryLine(tick, metrics, mode, law) {
  const idx = Math.floor((tick >>> 4) % CATALOG.length);
  let line = CATALOG[idx];

  if (metrics.horizonCollapse > 0.62) line = "prediction horizon collapsing";
  else if (metrics.compressibility > 0.72 && metrics.entropy < 0.62)
    line = "low-complexity invariant candidate detected";
  else if (metrics.compressibility < 0.35)
    line = "no low-complexity invariant found";

  const sym = symbolicLaw(mode, metrics);
  const tail =
    metrics.confidence < 34
      ? " — rejecting brittle symbolic fit"
      : metrics.confidence > 78
      ? ` — hypothesis "${sym.equation}" ranked high`
      : "";

  return `[t=${tick}] ${line}${tail} | law:${law}`;
}

export function observerHypothesisRanking(mode, metrics) {
  const primary = symbolicLaw(mode, metrics);
  const alts =
    mode === "gravity"
      ? ["vortex drag correction", "J₂ oblateness", "screened fifth force"]
      : mode === "chaos"
      ? ["coupled logistic lattice", "stochastic damping", "mean-field closure"]
      : ["alignment kernel", "topological winding", "entropic thermostat"];

  const score = primary.confidence;
  const rejected = metrics.horizonCollapse > 0.55 ? alts.slice(1) : [];

  return { primary: primary.equation, score, rejected };
}
