/** Canonical simulation space (must match physics + universe spawn). */
export const WORLD = {
  W: 1200,
  H: 720,
};

export function worldCenter(world = WORLD) {
  return { cx: world.W / 2, cy: world.H / 2 };
}

export function clampToWorld(x, y, margin = 20, world = WORLD) {
  return {
    x: Math.max(margin, Math.min(world.W - margin, x)),
    y: Math.max(margin, Math.min(world.H - margin, y)),
  };
}
