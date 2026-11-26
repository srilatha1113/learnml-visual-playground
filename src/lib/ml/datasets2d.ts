import { gaussian, mulberry32 } from "./random";

export type Point2 = { x: number; y: number; label: 0 | 1 };
export type Shape = "blobs" | "circles" | "xor" | "moons" | "spiral";

export const SHAPES: { id: Shape; name: string }[] = [
  { id: "blobs", name: "Two blobs" },
  { id: "circles", name: "Circles" },
  { id: "xor", name: "XOR" },
  { id: "moons", name: "Moons" },
  { id: "spiral", name: "Spiral" },
];

// Points live in [-1, 1] x [-1, 1].
export function makeDataset(shape: Shape, n: number, noise: number, seed: number): Point2[] {
  const rand = mulberry32(seed);
  const jitter = () => gaussian(rand) * noise;
  const out: Point2[] = [];
  for (let i = 0; i < n; i++) {
    const label = (i % 2) as 0 | 1;
    let x = 0;
    let y = 0;
    if (shape === "blobs") {
      const c = label ? 0.45 : -0.45;
      x = c + gaussian(rand) * 0.18;
      y = c + gaussian(rand) * 0.18;
    } else if (shape === "circles") {
      const r = label ? 0.75 : 0.28 * Math.sqrt(rand());
      const t = rand() * Math.PI * 2;
      x = r * Math.cos(t);
      y = r * Math.sin(t);
    } else if (shape === "xor") {
      x = rand() * 1.7 - 0.85;
      y = rand() * 1.7 - 0.85;
      x += Math.sign(x || 1) * 0.06;
      y += Math.sign(y || 1) * 0.06;
      out.push({ x: x + jitter(), y: y + jitter(), label: x * y > 0 ? 1 : 0 });
      continue;
    } else if (shape === "moons") {
      const t = rand() * Math.PI;
      if (label) {
        x = Math.cos(t) * 0.6 - 0.25;
        y = Math.sin(t) * 0.6 - 0.15;
      } else {
        x = 0.25 - Math.cos(t) * 0.6;
        y = 0.25 - Math.sin(t) * 0.6;
      }
    } else {
      const t = rand();
      const ang = t * 3.2 * Math.PI + (label ? Math.PI : 0);
      const r = 0.1 + t * 0.8;
      x = r * Math.cos(ang);
      y = r * Math.sin(ang);
    }
    out.push({ x: x + jitter(), y: y + jitter(), label });
  }
  return out;
}
