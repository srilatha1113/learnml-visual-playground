import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Bar, Container, PageHeader } from "@/components/Page";
import { MODULES } from "@/data/modules";
import { lessonKey, useProgress } from "@/lib/progress";
import { SITE_NAME } from "@/lib/site";

const title = `Modules — ${SITE_NAME}`;
const description =
  "Six beginner-friendly machine learning modules, from what a model is to neural networks.";

export const Route = createFileRoute("/modules/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ModulesPage,
});

function ModulesPage() {
  const { progress } = useProgress();
  return (
    <>
      <PageHeader
        kicker="Modules"
        title="Six modules, start to neural networks"
        intro="Work through them in order or jump to what you need. Each lesson takes a few minutes."
      />
      <Container>
        <ol className="grid gap-5 md:grid-cols-2">
          {MODULES.map((m) => {
            const done = m.lessons.filter((_, i) => progress.lessons[lessonKey(m.slug, i)]).length;
            const minutes = m.lessons.reduce((t, l) => t + l.minutes, 0);
            const complete = done === m.lessons.length;
            return (
              <li key={m.slug}>
                <Link
                  to="/modules/$slug"
                  params={{ slug: m.slug }}
                  className="group flex h-full flex-col rounded-md border-[1.5px] border-ink bg-card p-6 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-stamp"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-primary">{m.number}</span>
                    <span className="label-mono text-muted-foreground">
                      {m.level} · {m.lessons.length} lessons · {minutes} min
                    </span>
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold">{m.title}</h2>
                  <p className="mt-2 flex-1 text-muted-foreground">{m.summary}</p>
                  <div className="mt-5 flex items-center gap-3">
                    <Bar value={done / m.lessons.length} className="flex-1" />
                    <span className="flex items-center gap-1 font-mono text-sm tabular-nums">
                      {complete ? <Check className="size-4 text-success" /> : null}
                      {done}/{m.lessons.length}
                    </span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </Container>
    </>
  );
}
