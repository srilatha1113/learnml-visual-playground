import { useEffect, useRef } from "react";
import type { Point2 } from "@/lib/ml/datasets2d";
import { predict, type Net } from "@/lib/ml/mlp";
import { cn } from "@/lib/utils";

const CELLS = 48;

// Draws what a network predicts across the plane, with the data points on top.
// `tick` changes whenever the (mutable) net has been trained further.
export function BoundaryPlot({
  net,
  data,
  tick,
  className,
}: {
  net: Net | null;
  data: Point2[];
  tick: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !net) return;
    const css = getComputedStyle(document.documentElement);
    const colorA = css.getPropertyValue("--class-a").trim();
    const colorB = css.getPropertyValue("--class-b").trim();
    const size = canvas.width / CELLS;
    ctx.globalAlpha = 1;
    ctx.fillStyle = colorB;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = colorA;
    for (let j = 0; j < CELLS; j++) {
      for (let i = 0; i < CELLS; i++) {
        const x = ((i + 0.5) / CELLS) * 2 - 1;
        const y = 1 - ((j + 0.5) / CELLS) * 2;
        ctx.globalAlpha = predict(net, x, y);
        ctx.fillRect(i * size, j * size, size + 0.5, size + 0.5);
      }
    }
  }, [net, tick]);

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-md border-[1.5px] border-ink bg-card",
        className,
      )}
    >
      <canvas ref={canvasRef} width={240} height={240} className="absolute inset-0 size-full opacity-45" />
      <svg viewBox="-1 -1 2 2" className="absolute inset-0 size-full" role="img" aria-label="Data points over the model's prediction">
        {data.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={-p.y}
            r="0.03"
            className={p.label ? "fill-class-a stroke-card" : "fill-class-b stroke-card"}
            strokeWidth="0.008"
          />
        ))}
      </svg>
    </div>
  );
}
