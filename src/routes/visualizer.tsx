import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHeader, Segmented } from "@/components/Page";
import { GradientDescentViz } from "@/components/viz/GradientDescentViz";
import { KMeansViz } from "@/components/viz/KMeansViz";
import { KnnViz } from "@/components/viz/KnnViz";
import { SITE_NAME } from "@/lib/site";

const title = `Algorithm visualizer — ${SITE_NAME}`;
const description =
  "Step through gradient descent, K-means clustering and k-nearest neighbours and see exactly what each one does.";

export const Route = createFileRoute("/visualizer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: VisualizerPage,
});

type Algo = "gd" | "kmeans" | "knn";
const ALGOS: { id: Algo; name: string; blurb: string }[] = [
  {
    id: "gd",
    name: "Gradient descent",
    blurb: "A line starts in the wrong place and nudges itself, step by step, towards the best fit.",
  },
  {
    id: "kmeans",
    name: "K-means clustering",
    blurb: "Centres take turns claiming their nearest points and moving to the middle of them.",
  },
  {
    id: "knn",
    name: "K-nearest neighbours",
    blurb: "A new point is labelled by a vote among the points closest to it.",
  },
];

function VisualizerPage() {
  const [algo, setAlgo] = useState<Algo>("gd");
  const current = ALGOS.find((a) => a.id === algo);
  return (
    <>
      <PageHeader
        kicker="Algorithm visualizer"
        title="See what the algorithm is doing"
        intro="Pick an algorithm, then run it or step through one move at a time."
      />
      <Container>
        <Segmented label="Algorithm" options={ALGOS} value={algo} onChange={setAlgo} />
        <p className="mt-4 max-w-2xl text-muted-foreground">{current?.blurb}</p>
        <div className="panel mt-6 p-4 md:p-6">
          {algo === "gd" ? <GradientDescentViz /> : null}
          {algo === "kmeans" ? <KMeansViz /> : null}
          {algo === "knn" ? <KnnViz /> : null}
        </div>
      </Container>
    </>
  );
}
