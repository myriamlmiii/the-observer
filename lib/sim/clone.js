export function cloneBodies(bodies) {
  return bodies.map((b) => ({ ...b }));
}
