"use client";

import { useState } from "react";

export default function HoverTip({ label, explanation, children, align = "right" }) {
  const [on, setOn] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onPointerEnter={() => setOn(true)}
      onPointerLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
    >
      {children}

      <span className="sr-only">{label}: {explanation}</span>

      {on && (
        <span
          className={`pointer-events-none absolute z-50 mt-2 w-[min(20rem,calc(100vw-3rem))] rounded-xl border border-cyan-300/25 bg-[#050816]/94 px-3 py-2 text-[11px] leading-relaxed tracking-wide text-cyan-50/92 shadow-xl shadow-black/55 backdrop-blur-xl ${
            align === "right" ? "left-0 top-full" : "right-0 top-full"
          }`}
          role="tooltip"
        >
          <span className="block select-none font-mono text-[9px] uppercase tracking-[0.24em] text-fuchsia-200/85">
            {label}
          </span>
          <span className="mt-1.5 block text-white/82">{explanation}</span>
        </span>
      )}
    </span>
  );
}
