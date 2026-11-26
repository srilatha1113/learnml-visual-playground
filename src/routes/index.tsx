import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Database,
  FlaskConical,
  LayoutDashboard,
  ListChecks,
  Waypoints,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroDemo } from "@/components/HeroDemo";
import { MODULES, TOTAL_LESSONS } from "@/data/modules";
import { DATASETS } from "@/data/datasets";
import { SITE_NAME } from "@/lib/site";

const title = `${SITE_NAME} — learn machine learning by playing with it`;
const description =
  "Short lessons, live algorithm visualizers, a neural network playground, a dataset library and quizzes. Free, in your browser.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Home,
});

const FEATURES = [
  {
    to: "/modules",
    icon: BookOpen,
    name: "Modules",
    text: `${MODULES.length} short courses, ${TOTAL_LESSONS} lessons, written in plain language.`,
  },
  {
    to: "/visualizer",
    icon: Waypoints,
    name: "Algorithm visualizer",
    text: "Step through gradient descent, K-means and nearest neighbours.",
  },
  {
    to: "/playground",
    icon: FlaskConical,
    name: "Playground",
    text: "Build a neural network, press train and watch it learn.",
  },
  {
    to: "/datasets",
    icon: Database,
    name: "Dataset library",
    text: `${DATASETS.length} classic datasets with what they contain and where to get them.`,
  },
  {
    to: "/quiz",
    icon: ListChecks,
    name: "Quiz",
    text: "Check what stuck, with an explanation after every answer.",
  },
  {
    to: "/dashboard",
    icon: LayoutDashboard,
    name: "Dashboard",
    text: "See your lessons, scores and what to do next.",
  },
] as const;

function Home() {
  return (
    <>
      <section className="border-b-[1.5px] border-ink bg-grid">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
          <div>
            <p className="label-mono text-primary">Interactive machine learning course</p>
            <h1 className="mt-4 text-5xl leading-[1.02] font-semibold text-balance md:text-7xl">
              Don’t read about models. <em className="text-primary">Train one.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              {SITE_NAME} teaches machine learning from zero with lessons you can finish in
              minutes and experiments you run yourself.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/modules">
                  Start the first lesson
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/playground">Open the playground</Link>
              </Button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <HeroDemo />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className="text-3xl font-semibold md:text-4xl">Everything in one lab</h2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <li key={f.to}>
              <Link
                to={f.to}
                className="group flex h-full flex-col rounded-md border-[1.5px] border-ink bg-card p-5 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-stamp"
              >
                <f.icon className="size-6 text-primary" />
                <h3 className="mt-4 text-xl font-semibold">{f.name}</h3>
                <p className="mt-1.5 flex-1 text-muted-foreground">{f.text}</p>
                <span className="label-mono mt-4 flex items-center gap-1.5">
                  Open
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y-[1.5px] border-ink bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-3 md:px-6">
          {[
            ["01", "Read", "A lesson takes five to eight minutes and ends with one thing to remember."],
            ["02", "Play", "Open the matching visualizer and change the settings until it clicks."],
            ["03", "Check", "Take the quiz. Your scores and progress wait on your dashboard."],
          ].map(([n, t, d]) => (
            <div key={n}>
              <div className="font-mono text-sm text-primary">{n}</div>
              <h3 className="mt-2 text-2xl font-semibold">{t}</h3>
              <p className="mt-2 opacity-80">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-16 md:px-6">
        <div className="panel flex flex-col items-start gap-5 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold">Keep your progress everywhere</h2>
            <p className="mt-2 text-muted-foreground">
              Create a free account and your lessons and scores follow you to any device.
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/auth">Create an account</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
