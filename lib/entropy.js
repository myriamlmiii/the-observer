export function shannonEntropy(values, bins = 20) {
  if (!values || values.length === 0) return 0;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const counts = Array(bins).fill(0);

  for (const v of values) {
    const index = Math.min(
      bins - 1,
      Math.max(0, Math.floor(((v - min) / span) * bins))
    );
    counts[index]++;
  }

  let entropy = 0;
  for (const count of counts) {
    if (count === 0) continue;
    const p = count / values.length;
    entropy -= p * Math.log2(p);
  }

  return entropy / Math.log2(bins);
}