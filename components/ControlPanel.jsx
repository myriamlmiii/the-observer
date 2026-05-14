"use client";

export default function ControlPanel({
  gravity,
  setGravity,
  entropy,
  setEntropy,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
      <h2 className="mb-4 text-xl font-black">Reality Controls</h2>

      <div className="space-y-5">
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span>Gravity</span>
            <span>{gravity.toFixed(2)}</span>
          </div>

          <input
            type="range"
            min="0.1"
            max="3"
            step="0.05"
            value={gravity}
            onChange={(e) => setGravity(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span>Entropy</span>
            <span>{entropy.toFixed(2)}</span>
          </div>

          <input
            type="range"
            min="0"
            max="4"
            step="0.05"
            value={entropy}
            onChange={(e) => setEntropy(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}