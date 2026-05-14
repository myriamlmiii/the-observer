import { WORLD } from "./world";

const { W, H } = WORLD;
const CX = W / 2;
const CY = H / 2;

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export function physicsStep(bodies, settings) {
  const { gravity, entropy, mode, blackHoles = [], timeScale = 1 } = settings;
  const next = bodies.map((b) => ({ ...b }));

  for (const a of next) {
    if (a.fixed) continue;

    let ax = 0;
    let ay = 0;

    for (const b of next) {
      if (a.id === b.id) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d2 = dx * dx + dy * dy + 160;
      const d = Math.sqrt(d2);
      const force = (gravity * b.mass) / d2;
      ax += (dx / d) * force * 0.1;
      ay += (dy / d) * force * 0.1;
    }

    for (const hole of blackHoles) {
      const dx = hole.x - a.x;
      const dy = hole.y - a.y;
      const d2 = dx * dx + dy * dy + 30;
      const d = Math.sqrt(d2);
      const force = hole.power / d2;
      ax += (dx / d) * force;
      ay += (dy / d) * force;
    }

    if (mode === "swarm") {
      ax += (CX - a.x) * 0.0007;
      ay += (CY - a.y) * 0.0007;
      const curl = Math.atan2(CY - a.y, CX - a.x) + Math.PI / 2;
      ax += Math.cos(curl) * 0.018;
      ay += Math.sin(curl) * 0.018;
    }

    if (mode === "chaos") {
      ax += Math.sin(a.y * 0.015) * 0.035;
      ay += Math.cos(a.x * 0.015) * 0.035;
    }

    a.vx = (a.vx + ax * timeScale + (Math.random() - 0.5) * entropy * 0.035) * 0.998;
    a.vy = (a.vy + ay * timeScale + (Math.random() - 0.5) * entropy * 0.035) * 0.998;

    a.x += a.vx * timeScale;
    a.y += a.vy * timeScale;

    if (a.x < 20 || a.x > W - 20) a.vx *= -0.92;
    if (a.y < 20 || a.y > H - 20) a.vy *= -0.92;

    a.x = clamp(a.x, 20, W - 20);
    a.y = clamp(a.y, 20, H - 20);
  }

  return next;
}
