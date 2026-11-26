import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Readout, Sparkline } from "@/components/Page";
import { gaussian, mulberry32 } from "@/lib/ml/random";
import { plotPoint } from "./shared";

type P = { x: number; y: number };
type Fit = { w: number; b: number; history: number[] };

function initialPoints(): P[] {
  const rand = mulberry32(7);
  return Array.from({ length: 22 }, () => {
    const x = 0.08 + rand() * 0.84;
    return { x, y: Math.min(0.95, Math.max(0.05, 0.2 + 0.6 * x + gaussian(rand) * 0.07)) };
  });
}

export function mse(points: P[], w: number, b: number) {
  if (!points.length) return 0;
  return points.reduce((s, p) => s + (w * p.x + b - p.y) ** 2, 0) / points.length;
}

export function gdStep(points: P[], w: number, b: number, lr: number) {
  const n = points.length || 1;
  let gw = 0;
  let gb = 0;
  for (const p of points) {
    const err = w * p.x + b - p.y;
    gw += (2 / n) * err * p.x;
    gb += (2 / n) * err;
  }
  return { w: w - lr * gw, b: b - lr * gb };
}

const START = { w: -0.5, b: 0.85 };

export function GradientDescentViz() {
  const [points, setPoints] = useState<P[]>(initialPoints);
  const [lr, setLr] = useState(0.3);
  const [fit, setFit] = useState<Fit>({ ...START, history: [] });
  const [playing, setPlaying] = useState(false);

  const loss = useMemo(() => mse(points, fit.w, fit.b), [points, fit]);
  const diverged = !Number.isFinite(loss) || loss > 1e6;

  const step = () =>
    setFit((f) => {
      const next = gdStep(points, f.w, f.b, lr);
      return { ...next, history: [...f.history, mse(points, next.w, next.b)].slice(-150) };
    });

  useEffect(() => {
    if (!playing) return;
    if (diverged) {
      setPlaying(false);
      return;
    }
    const id = window.setInterval(step, 90);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, points, lr, diverged]);

  const reset = () => {
    setPlaying(false);
    setFit({ ...START, history: [] });
  };

  const y0 = fit.b;
  const y1 = fit.w + fit.b;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div>
        <svg
          viewBox="0 0 100 100"
          className="plot aspect-square w-full cursor-crosshair touch-none"
          onPointerDown={(e) => {
            const p = plotPoint(e);
            setPoints((ps) => [...ps, p]);
          }}
          role="img"
          aria-label="Scatter plot with the fitted line. Click to add a point."
        >
          {!diverged
            ? points.map((p, i) => (
                <line
                  key={`r${i}`}
                  x1={p.x * 100}
                  x2={p.x * 100}
                  y1={100 - p.y * 100}
                  y2={100 - (fit.w * p.x + fit.b) * 100}
                  className="stroke-class-c"
                  strokeWidth="0.5"
                />
              ))
            : null}
          {points.map((p, i) => (
            <circle key={i} cx={p.x * 100} cy={100 - p.y * 100} r="1.5" className="fill-class-b" />
          ))}
          {!diverged ? (
            <line
              x1="0"
              x2="100"
              y1={100 - y0 * 100}
              y2={100 - y1 * 100}
              className="stroke-primary"
              strokeWidth="1"
            />
          ) : null}
        </svg>
        <p className="mt-2 text-sm text-muted-foreground">
          Click anywhere on the plot to add a point. Yellow bars are the errors the line is trying
          to shrink.
        </p>
      </div>

      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setPlaying((p) => !p)} disabled={diverged}>
            {playing ? <Pause /> : <Play />}
            {playing ? "Pause" : "Run"}
          </Button>
          <Button variant="outline" onClick={step} disabled={playing || diverged}>
            <StepForward />
            Step
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw />
            Reset line
          </Button>
        </div>

        <Field label="Learning rate" value={lr.toFixed(2)}>
          <input
            type="range"
            min={0.01}
            max={1}
            step={0.01}
            value={lr}
            onChange={(e) => setLr(Number(e.target.value))}
            className="w-full"
          />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Readout label="Steps" value={fit.history.length} />
          <Readout label="Error (MSE)" value={diverged ? "∞" : loss.toFixed(4)} />
          <Readout label="Slope" value={diverged ? "–" : fit.w.toFixed(3)} />
          <Readout label="Intercept" value={diverged ? "–" : fit.b.toFixed(3)} />
        </div>

        <div>
          <div className="label-mono text-muted-foreground">Error over time</div>
          <Sparkline values={fit.history} />
        </div>

        {diverged ? (
          <p className="rounded-sm border-[1.5px] border-destructive bg-card p-3 text-sm">
            The error exploded. The learning rate is too large, so every step overshoots. Lower it
            and reset the line.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Try a learning rate of 0.05, then 0.9. Small steps are slow; big steps overshoot.
          </p>
        )}
      </div>
    </div>
  );
}
