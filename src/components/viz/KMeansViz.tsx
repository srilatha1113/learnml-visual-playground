import { useEffect, useMemo, useState } from "react";
import { Pause, Play, Shuffle, StepForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Readout } from "@/components/Page";
import { gaussian, mulberry32 } from "@/lib/ml/random";
import { CLASS_FILL, CLASS_STROKE } from "./shared";

type P = { x: number; y: number };
type State = {
  centroids: P[];
  assign: number[];
  phase: "assign" | "move";
  rounds: number;
  done: boolean;
};

function makePoints(): P[] {
  const rand = mulberry32(21);
  const centres: P[] = [
    { x: 0.25, y: 0.72 },
    { x: 0.72, y: 0.75 },
    { x: 0.3, y: 0.25 },
    { x: 0.75, y: 0.28 },
  ];
  const clamp = (v: number) => Math.min(0.97, Math.max(0.03, v));
  return Array.from({ length: 96 }, (_, i) => {
    const c = centres[i % centres.length]!;
    return { x: clamp(c.x + gaussian(rand) * 0.085), y: clamp(c.y + gaussian(rand) * 0.085) };
  });
}

export function nearest(p: P, centroids: P[]) {
  let best = 0;
  let bestD = Infinity;
  centroids.forEach((c, i) => {
    const d = (c.x - p.x) ** 2 + (c.y - p.y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
}

function start(points: P[], k: number, seed: number): State {
  const rand = mulberry32(seed);
  const pool = [...points];
  const centroids: P[] = [];
  for (let i = 0; i < k && pool.length; i++) {
    const [picked] = pool.splice(Math.floor(rand() * pool.length), 1);
    if (picked) centroids.push(picked);
  }
  return { centroids, assign: [], phase: "assign", rounds: 0, done: false };
}

function advance(points: P[], s: State): State {
  if (s.done) return s;
  if (s.phase === "assign") {
    const assign = points.map((p) => nearest(p, s.centroids));
    const same = s.assign.length > 0 && assign.every((a, i) => a === s.assign[i]);
    return { ...s, assign, phase: "move", done: same };
  }
  const centroids = s.centroids.map((c, i) => {
    const mine = points.filter((_, j) => s.assign[j] === i);
    if (!mine.length) return c;
    return {
      x: mine.reduce((t, p) => t + p.x, 0) / mine.length,
      y: mine.reduce((t, p) => t + p.y, 0) / mine.length,
    };
  });
  return { ...s, centroids, phase: "assign", rounds: s.rounds + 1 };
}

export function KMeansViz() {
  const points = useMemo(makePoints, []);
  const [k, setK] = useState(4);
  const [seed, setSeed] = useState(3);
  const [state, setState] = useState<State>(() => start(points, 4, 3));
  const [playing, setPlaying] = useState(false);

  const restart = (nextK: number, nextSeed: number) => {
    setPlaying(false);
    setK(nextK);
    setSeed(nextSeed);
    setState(start(points, nextK, nextSeed));
  };

  useEffect(() => {
    if (!playing) return;
    if (state.done) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setState((s) => advance(points, s)), 550);
    return () => window.clearTimeout(id);
  }, [playing, state, points]);

  const status = state.done
    ? "Settled. No point changed group, so the clusters are final."
    : state.phase === "assign"
      ? "Next: give every point to its nearest centre."
      : "Next: move each centre to the middle of its points.";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <svg
        viewBox="0 0 100 100"
        className="plot aspect-square w-full"
        role="img"
        aria-label="Scatter plot of points coloured by their cluster"
      >
        {points.map((p, i) => {
          const a = state.assign[i];
          return (
            <circle
              key={i}
              cx={p.x * 100}
              cy={100 - p.y * 100}
              r="1.4"
              className={a === undefined ? "fill-muted-foreground" : CLASS_FILL[a]}
              style={{ transition: "fill 300ms" }}
            />
          );
        })}
        {state.centroids.map((c, i) => (
          <g
            key={i}
            style={{
              transform: `translate(${c.x * 100}px, ${100 - c.y * 100}px)`,
              transition: "transform 400ms ease-out",
            }}
          >
            <rect x="-3" y="-3" width="6" height="6" className={`fill-card ${CLASS_STROKE[i]}`} strokeWidth="1.4" transform="rotate(45)" />
            <circle r="1" className={CLASS_FILL[i]} />
          </g>
        ))}
      </svg>

      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setPlaying((p) => !p)} disabled={state.done}>
            {playing ? <Pause /> : <Play />}
            {playing ? "Pause" : "Run"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setState((s) => advance(points, s))}
            disabled={playing || state.done}
          >
            <StepForward />
            Step
          </Button>
          <Button variant="ghost" onClick={() => restart(k, seed + 1)}>
            <Shuffle />
            New start
          </Button>
        </div>

        <Field label="Number of clusters (k)" value={k}>
          <input
            type="range"
            min={2}
            max={6}
            step={1}
            value={k}
            onChange={(e) => restart(Number(e.target.value), seed)}
            className="w-full"
          />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Readout label="Rounds" value={state.rounds} />
          <Readout label="Status" value={state.done ? "Settled" : "Running"} />
        </div>

        <p className="rounded-sm border border-border bg-background p-3 text-sm">{status}</p>
        <p className="text-sm text-muted-foreground">
          Diamonds are the cluster centres. Press “New start” a few times: different starting
          spots can end in different groupings.
        </p>
      </div>
    </div>
  );
}
