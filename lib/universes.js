import { WORLD } from "./world";
import { createRng, randRange } from "./rng";

const { W, H } = WORLD;
const CX = W / 2;
const CY = H / 2;

export function makeUniverse(mode = "gravity", seed = mode) {
  const rng = createRng(`universe:${mode}:${seed}`);
  const rand = (min, max) => randRange(rng, min, max);

  if (mode === "gravity") {
    return [
      { id: "sun", x: CX, y: CY, vx: 0, vy: 0, mass: 18000, r: 18, fixed: true, type: "star" },
      ...Array.from({ length: 75 }, (_, i) => {
        const angle = (i / 75) * Math.PI * 2;
        const radius = rand(120, 330);
        return {
          id: `body-${i}`,
          x: CX + Math.cos(angle) * radius,
          y: CY + Math.sin(angle) * radius,
          vx: -Math.sin(angle) * rand(0.7, 2.2),
          vy: Math.cos(angle) * rand(0.7, 2.2),
          mass: rand(3, 18),
          r: rand(1.8, 4.2),
          type: "particle",
        };
      }),
    ];
  }

  if (mode === "chaos") {
    return Array.from({ length: 120 }, (_, i) => ({
      id: `chaos-${i}`,
      x: rand(80, W - 80),
      y: rand(80, H - 80),
      vx: rand(-2.8, 2.8),
      vy: rand(-2.8, 2.8),
      mass: rand(2, 12),
      r: rand(1.4, 3.2),
      type: "particle",
    }));
  }

  return Array.from({ length: 160 }, (_, i) => {
    const a = (i / 160) * Math.PI * 2;
    const radius = rand(40, 330);
    return {
      id: `swarm-${i}`,
      x: CX + Math.cos(a) * radius,
      y: CY + Math.sin(a) * radius,
      vx: -Math.sin(a) * rand(0.4, 1.5),
      vy: Math.cos(a) * rand(0.4, 1.5),
      mass: rand(2, 9),
      r: rand(1.2, 2.9),
      type: "particle",
    };
  });
}
