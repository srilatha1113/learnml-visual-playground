import { useEffect, useMemo, useRef, useState } from "react";
import { BoundaryPlot } from "@/components/viz/BoundaryPlot";
import { makeDataset, type Shape } from "@/lib/ml/datasets2d";
import { accuracy, createNet, trainEpoch, type Net } from "@/lib/ml/mlp";

const ORDER: Shape[] = ["circles", "moons", "xor"];
const EPOCHS = 160;

// A small network that trains itself on loop, so the home page shows learning happening.
export function HeroDemo() {
  const [round, setRound] = useState(0);
  const [tick, setTick] = useState(0);
  const shape = ORDER[round % ORDER.length] ?? "circles";
  const data = useMemo(() => makeDataset(shape, 160, 0.05, 11 + round), [shape, round]);
  const netRef = useRef<Net | null>(null);
  const [net, setNet] = useState<Net | null>(null);
  const epochRef = useRef(0);

  useEffect(() => {
    const fresh = createNet([2, 6, 6, 1], "tanh", 5 + round);
    netRef.current = fresh;
    epochRef.current = 0;
    setNet(fresh);
    setTick((t) => t + 1);
    let pause = 0;
    const id = window.setInterval(() => {
      const n = netRef.current;
      if (!n) return;
      if (epochRef.current >= EPOCHS) {
        pause++;
        if (pause > 25) setRound((r) => r + 1);
        return;
      }
      trainEpoch(n, data, 0.05);
      epochRef.current++;
      setTick((t) => t + 1);
    }, 60);
    return () => window.clearInterval(id);
  }, [data, round]);

  const acc = net ? accuracy(net, data) : 0;

  return (
    <div className="panel p-3">
      <BoundaryPlot net={net} data={data} tick={tick} />
      <div className="mt-3 flex items-center justify-between font-mono text-xs">
        <span className="label-mono text-muted-foreground">Live: a network learning</span>
        <span className="tabular-nums" key={tick}>
          epoch {String(epochRef.current).padStart(3, "0")} · {Math.round(acc * 100)}% correct
        </span>
      </div>
    </div>
  );
}
