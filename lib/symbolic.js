export function symbolicLaw(mode, metrics) {
    const { entropy, compressibility, predictionError } = metrics;
  
    if (mode === "gravity") {
      if (compressibility > 0.6) {
        return {
          equation: "F ∝ m/r²",
          confidence: 0.92,
        };
      }
  
      return {
        equation: "F ≈ unknown central interaction",
        confidence: 0.51,
      };
    }
  
    if (mode === "chaos") {
      return {
        equation: "x(t+1)=f(x₁...xₙ), λ > 0",
        confidence: 0.43,
      };
    }
  
    if (mode === "swarm") {
      return {
        equation: "vᵢ ← local alignment + stochastic drift",
        confidence: 0.67,
      };
    }
  
    return {
      equation: "No stable symbolic law discovered",
      confidence: Math.max(0, 1 - entropy - predictionError * 0.01),
    };
  }