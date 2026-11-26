import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pause, Play, RotateCcw, Shuffle, StepForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Field, PageHeader, Readout, Segmented, Sparkline } from "@/components/Page";
import { BoundaryPlot } from "@/components/viz/BoundaryPlot";
import { makeDataset, SHAPES, type Shape } from "@/lib/ml/datasets2d";
import { accuracy, createNet, trainEpoch, type Activation, type Net } from "@/lib/ml/mlp";
import { SITE_NAME } from "@/lib/site";

const title = `Neural network playground — ${SITE_NAME}`;
const description =
  "Choose a dataset, set the layers, neurons and learning rate, then train a neural network in your browser and watch its decision boundary form.";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: PlaygroundPage,
});

const RATES = [0.003, 0.01, 0.03, 0.1, 0.3].map((r) => ({ id: r, name: String(r) }));
const ACTS: { id: Activation; name: string }[] = [
  { id: "tanh", name: "Tanh" },
  { id: "relu", name: "ReLU" },
];

function PlaygroundPage() {
  const [shape, setShape] = useState<Shape>("circles");
  const [noise, setNoise] = useState(0.05);
  const [dataSeed, setDataSeed] = useState(1);
  const [layers, setLayers] = useState(2);
  const [neurons, setNeurons] = useState(4);
  const [act, setAct] = useState<Activation>("tanh");
  const [lr, setLr] = useState(0.03);
  const [netSeed, setNetSeed] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [tick, setTick] = useState(0);

  const data = useMemo(() => makeDataset(shape, 200, noise, dataSeed), [shape, noise, dataSeed]);
  const net = useMemo<Net>(
    () => createNet([2, ...Array.from({ length: layers }, () => neurons), 1], act, netSeed),
    [layers, neurons, act, netSeed],
  );
  const stats = useRef({ epoch: 0, losses: [] as number[] });

  // A new network or new data starts training from scratch.
  useEffect(() => {
    stats.current = { epoch: 0, losses: [] };
    setTick((t) => t + 1);
  }, [net, data]);

  const step = () => {
    const loss = trainEpoch(net, data, lr);
    stats.current.epoch++;
    stats.current.losses = [...stats.current.losses, loss].slice(-200);
    setTick((t) => t + 1);
  };

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(step, 50);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, net, data, lr]);

  const { epoch, losses } = stats.current;
  const lastLoss = losses[losses.length - 1];
  const acc = accuracy(net, data);

  return (
    <>
      <PageHeader
        kicker="Playground"
        title="Build a network and watch it learn"
        intro="The coloured background is what the network currently believes. Train it until the colours match the dots."
      />
      <Container>
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_260px]">
          <div className="panel space-y-5 p-5">
            <Field label="Dataset">
              <Segmented label="Dataset" options={SHAPES} value={shape} onChange={setShape} />
            </Field>
            <Field label="Noise" value={noise.toFixed(2)}>
              <input
                type="range"
                min={0}
                max={0.25}
                step={0.01}
                value={noise}
                onChange={(e) => setNoise(Number(e.target.value))}
                className="w-full"
              />
            </Field>
            <Field label="Hidden layers" value={layers}>
              <input
                type="range"
                min={1}
                max={3}
                step={1}
                value={layers}
                onChange={(e) => setLayers(Number(e.target.value))}
                className="w-full"
              />
            </Field>
            <Field label="Neurons per layer" value={neurons}>
              <input
                type="range"
                min={1}
                max={8}
                step={1}
                value={neurons}
                onChange={(e) => setNeurons(Number(e.target.value))}
                className="w-full"
              />
            </Field>
            <Field label="Activation">
              <Segmented label="Activation" options={ACTS} value={act} onChange={setAct} />
            </Field>
            <Field label="Learning rate">
              <Segmented label="Learning rate" options={RATES} value={lr} onChange={setLr} />
            </Field>
          </div>

          <div>
            <BoundaryPlot net={net} data={data} tick={tick} />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => setPlaying((p) => !p)}>
                {playing ? <Pause /> : <Play />}
                {playing ? "Pause" : "Train"}
              </Button>
              <Button variant="outline" onClick={step} disabled={playing}>
                <StepForward />
                One epoch
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setPlaying(false);
                  setNetSeed((s) => s + 1);
                }}
              >
                <RotateCcw />
                Reset network
              </Button>
              <Button variant="ghost" onClick={() => setDataSeed((s) => s + 1)}>
                <Shuffle />
                New data
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              <Readout label="Epoch" value={epoch} />
              <Readout label="Accuracy" value={`${(acc * 100).toFixed(1)}%`} />
              <Readout label="Loss" value={lastLoss === undefined ? "–" : lastLoss.toFixed(4)} />
            </div>
            <div>
              <div className="label-mono text-muted-foreground">Loss over time</div>
              <Sparkline values={losses} />
            </div>
            <div className="rounded-sm border border-border bg-card p-4 text-sm">
              <div className="label-mono text-muted-foreground">Things to try</div>
              <ul className="mt-2 list-disc space-y-1.5 pl-4">
                <li>Circles with 1 neuron: it cannot close the ring. Add neurons.</li>
                <li>Spiral needs 3 layers of 8 and patience.</li>
                <li>Set the learning rate to 0.3 and watch the loss jump around.</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
