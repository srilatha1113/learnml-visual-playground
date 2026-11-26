import { mulberry32 } from "./random";
import type { Point2 } from "./datasets2d";

export type Activation = "tanh" | "relu";
export type Net = { W: number[][][]; b: number[][]; act: Activation };

// sizes e.g. [2, 4, 4, 1]; the output layer is always a single sigmoid unit.
export function createNet(sizes: number[], act: Activation, seed: number): Net {
  const rand = mulberry32(seed);
  const W: number[][][] = [];
  const b: number[][] = [];
  for (let l = 1; l < sizes.length; l++) {
    const nin = sizes[l - 1] ?? 1;
    const nout = sizes[l] ?? 1;
    const scale = Math.sqrt(2 / nin);
    W.push(
      Array.from({ length: nout }, () =>
        Array.from({ length: nin }, () => (rand() * 2 - 1) * scale),
      ),
    );
    b.push(Array.from({ length: nout }, () => 0));
  }
  return { W, b, act };
}

const f = (act: Activation, z: number) => (act === "tanh" ? Math.tanh(z) : Math.max(0, z));
const df = (act: Activation, a: number) => (act === "tanh" ? 1 - a * a : a > 0 ? 1 : 0);
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

function forward(net: Net, input: number[]): number[][] {
  const acts: number[][] = [input];
  let cur = input;
  const L = net.W.length;
  for (let l = 0; l < L; l++) {
    const Wl = net.W[l]!;
    const bl = net.b[l]!;
    const next = Wl.map((row, j) => {
      let z = bl[j]!;
      for (let i = 0; i < row.length; i++) z += row[i]! * cur[i]!;
      return l === L - 1 ? sigmoid(z) : f(net.act, z);
    });
    acts.push(next);
    cur = next;
  }
  return acts;
}

export function predict(net: Net, x: number, y: number): number {
  const acts = forward(net, [x, y]);
  return acts[acts.length - 1]![0]!;
}

// One pass of stochastic gradient descent over the data. Mutates the net; returns mean loss.
export function trainEpoch(net: Net, data: Point2[], lr: number): number {
  let loss = 0;
  const L = net.W.length;
  for (const p of data) {
    const acts = forward(net, [p.x, p.y]);
    const out = acts[L]![0]!;
    const eps = 1e-7;
    loss += -(p.label * Math.log(out + eps) + (1 - p.label) * Math.log(1 - out + eps));
    let delta = [out - p.label];
    for (let l = L - 1; l >= 0; l--) {
      const Wl = net.W[l]!;
      const bl = net.b[l]!;
      const aPrev = acts[l]!;
      const prevDelta = aPrev.map(() => 0);
      for (let j = 0; j < Wl.length; j++) {
        const row = Wl[j]!;
        const d = delta[j]!;
        for (let i = 0; i < row.length; i++) {
          prevDelta[i]! += row[i]! * d;
          row[i] = row[i]! - lr * d * aPrev[i]!;
        }
        bl[j] = bl[j]! - lr * d;
      }
      if (l > 0) delta = prevDelta.map((d, i) => d * df(net.act, aPrev[i]!));
    }
  }
  return data.length ? loss / data.length : 0;
}

export function accuracy(net: Net, data: Point2[]): number {
  if (!data.length) return 0;
  let ok = 0;
  for (const p of data) if ((predict(net, p.x, p.y) > 0.5 ? 1 : 0) === p.label) ok++;
  return ok / data.length;
}
