"use client";

export default function ScientificTraces({ values = [] }) {
  const w = 320;
  const h = 90;

  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);

  const span = max - min || 1;

  const d = values
    .map((v, i) => {
      const x = (i / Math.max(1, values.length - 1)) * w;

      const y = h - ((v - min) / span) * h;

      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-24 w-full">
        <path
          d={d}
          fill="none"
          stroke="#67e8f9"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}