export function discoverLaws(
    bodies,
    analysis
  ) {
    const laws = [];
  
    const avgSpeed =
      bodies.reduce(
        (s, b) =>
          s +
          Math.sqrt(
            b.vx * b.vx +
              b.vy * b.vy
          ),
        0
      ) / bodies.length;
  
    if (analysis.entropy < 0.35) {
      laws.push({
        title:
          "Low entropy invariant",
  
        confidence: 92,
  
        equation:
          "ΔS/Δt ≈ 0",
  
        description:
          "The observer detected stable low-entropy structure across time.",
      });
    }
  
    if (
      analysis.compressibility >
      0.6
    ) {
      laws.push({
        title:
          "Compressible dynamics",
  
        confidence: 87,
  
        equation:
          "K(x) << |x|",
  
        description:
          "The universe appears reducible into reusable symbolic structure.",
      });
    }
  
    if (avgSpeed < 1.2) {
      laws.push({
        title:
          "Bounded velocity regime",
  
        confidence: 79,
  
        equation:
          "|v| < c*",
  
        description:
          "Trajectory divergence remains bounded.",
      });
    }
  
    if (
      analysis.chaos > 0.7
    ) {
      laws.push({
        title:
          "Chaotic amplification",
  
        confidence: 94,
  
        equation:
          "δx(t) ≈ e^λt",
  
        description:
          "Microscopic perturbations amplify exponentially.",
      });
    }
  
    return laws;
  }