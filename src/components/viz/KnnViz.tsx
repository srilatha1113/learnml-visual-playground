import { useMemo, useState } from "react";
import { Field, Readout } from "@/components/Page";
import { gaussian, mulberry32 } from "@/lib/ml/random";
import { CLASS_BG, CLASS_FILL, CLASS_STROKE, plotPoint } from "./shared";

type P = { x: number; y: number; label: number };
const NAMES = ["Red", "Teal", "Yellow"];

function makePoints(): P[] {
  const rand = mulberry32(99);
  const centres = [
    { x: 0.3, y: 0.68 },
    { x: 0.7, y: 0.62 },
    { x: 0.48, y: 0.26 },
  ];
  const clamp = (v: number) => Math.min(0.97, Math.max(0.03, v));
  return Array.from({ length: 54 }, (_, i) => {
    const label = i % 3;
    const c = centres[label]!;
    return { x: clamp(c.x + gaussian(rand) * 0.13), y: clamp(c.y + gaussian(rand) * 0.13), label };
  });
}

export function knnVote(points: P[], q: { x: number; y: number }, k: number) {
  const neighbours = [...points]
    .sort((a, b) => (a.x - q.x) ** 2 + (a.y - q.y) ** 2 - ((b.x - q.x) ** 2 + (b.y - q.y) ** 2))
    .slice(0, k);
  const votes = [0, 0, 0];
  for (const n of neighbours) votes[n.label] = (votes[n.label] ?? 0) + 1;
  let winner = 0;
  votes.forEach((v, i) => {
    if (v > (votes[winner] ?? 0)) winner = i;
  });
  return { neighbours, votes, winner };
}

const GRID = 24;

export function KnnViz() {
  const points = useMemo(makePoints, []);
  const [k, setK] = useState(5);
  const [q, setQ] = useState({ x: 0.5, y: 0.5 });
  const [dragging, setDragging] = useState(false);

  const regions = useMemo(() => {
    const cells: number[] = [];
    for (let j = 0; j < GRID; j++)
      for (let i = 0; i < GRID; i++)
        cells.push(knnVote(points, { x: (i + 0.5) / GRID, y: (j + 0.5) / GRID }, k).winner);
    return cells;
  }, [points, k]);

  const { neighbours, votes, winner } = knnVote(points, q, k);
  const size = 100 / GRID;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div>
        <svg
          viewBox="0 0 100 100"
          className="plot aspect-square w-full cursor-crosshair touch-none"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setDragging(true);
            setQ(plotPoint(e));
          }}
          onPointerMove={(e) => {
            if (dragging) setQ(plotPoint(e));
          }}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          role="img"
          aria-label="Scatter plot of three groups with a movable query point"
        >
          {regions.map((w, idx) => (
            <rect
              key={idx}
              x={(idx % GRID) * size}
              y={100 - (Math.floor(idx / GRID) + 1) * size}
              width={size + 0.05}
              height={size + 0.05}
              className={CLASS_FILL[w]}
              opacity="0.16"
            />
          ))}
          {neighbours.map((n, i) => (
            <line
              key={i}
              x1={q.x * 100}
              y1={100 - q.y * 100}
              x2={n.x * 100}
              y2={100 - n.y * 100}
              className="stroke-foreground"
              strokeWidth="0.35"
              strokeDasharray="1 1"
            />
          ))}
          {points.map((p, i) => (
            <circle key={i} cx={p.x * 100} cy={100 - p.y * 100} r="1.5" className={CLASS_FILL[p.label]} />
          ))}
          <circle
            cx={q.x * 100}
            cy={100 - q.y * 100}
            r="2.8"
            className={`fill-card ${CLASS_STROKE[winner]}`}
            strokeWidth="1.6"
          />
          <circle cx={q.x * 100} cy={100 - q.y * 100} r="0.8" className="fill-foreground" />
        </svg>
        <p className="mt-2 text-sm text-muted-foreground">
          Click or drag on the plot to move the new point. Dashed lines lead to the neighbours
          that vote.
        </p>
      </div>

      <div className="space-y-5">
        <Field label="Neighbours (k)" value={k}>
          <input
            type="range"
            min={1}
            max={25}
            step={2}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="w-full"
          />
        </Field>

        <Readout
          label="Prediction"
          value={
            <span className="flex items-center gap-2">
              <span className={`inline-block size-3 rounded-full ${CLASS_BG[winner]}`} />
              {NAMES[winner]}
            </span>
          }
        />

        <div>
          <div className="label-mono text-muted-foreground">Votes</div>
          <ul className="mt-2 space-y-2">
            {NAMES.map((name, i) => (
              <li key={name} className="flex items-center gap-3 text-sm">
                <span className="w-14">{name}</span>
                <span className="h-3 flex-1 overflow-hidden rounded-full border border-border bg-background">
                  <span
                    className={`block h-full ${CLASS_BG[i]}`}
                    style={{ width: `${((votes[i] ?? 0) / k) * 100}%` }}
                  />
                </span>
                <span className="w-6 text-right font-mono tabular-nums">{votes[i] ?? 0}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-muted-foreground">
          The tinted background shows which group wins at every spot. Set k to 1 and the borders
          turn jagged; raise it and they smooth out.
        </p>
      </div>
    </div>
  );
}
