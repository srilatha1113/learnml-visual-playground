import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bar, Container, PageHeader } from "@/components/Page";
import { getModule, MODULES } from "@/data/modules";
import { lessonKey, toggleLesson, useProgress } from "@/lib/progress";
import { SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/modules/$slug")({
  loader: ({ params }) => {
    const module = getModule(params.slug);
    if (!module) throw notFound();
    return { module };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.module.title} — ${SITE_NAME}` : `Module — ${SITE_NAME}`;
    const description = loaderData?.module.summary ?? "A machine learning module.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  component: ModulePage,
});

function ModulePage() {
  const { module: m } = Route.useLoaderData();
  const { progress } = useProgress();
  const done = m.lessons.filter((_, i) => progress.lessons[lessonKey(m.slug, i)]).length;
  const index = MODULES.findIndex((x) => x.slug === m.slug);
  const next = MODULES[index + 1];

  return (
    <>
      <PageHeader kicker={`Module ${m.number} · ${m.level}`} title={m.title} intro={m.summary}>
        <div className="mt-6 flex max-w-md items-center gap-3">
          <Bar value={done / m.lessons.length} className="flex-1" />
          <span className="font-mono text-sm tabular-nums">
            {done}/{m.lessons.length} lessons
          </span>
        </div>
      </PageHeader>
      <Container className="max-w-3xl">
        <Link to="/modules" className="label-mono inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" />
          All modules
        </Link>

        <ol className="mt-6 space-y-6">
          {m.lessons.map((lesson, i) => {
            const isDone = !!progress.lessons[lessonKey(m.slug, i)];
            return (
              <li key={lesson.title} className="rounded-md border-[1.5px] border-ink bg-card p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="label-mono text-primary">
                    Lesson {i + 1} · {lesson.minutes} min
                  </span>
                  {isDone ? (
                    <span className="label-mono flex items-center gap-1 text-success">
                      <Check className="size-3.5" />
                      Done
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-2 text-2xl font-semibold">{lesson.title}</h2>
                {lesson.body.map((p) => (
                  <p key={p} className="mt-3 leading-relaxed">
                    {p}
                  </p>
                ))}
                <p className="mt-4 border-l-4 border-class-c bg-background px-4 py-3 text-sm">
                  <span className="label-mono mr-2 text-muted-foreground">Remember</span>
                  {lesson.takeaway}
                </p>
                <Button
                  className={cn("mt-5")}
                  variant={isDone ? "secondary" : "default"}
                  onClick={() => toggleLesson(m.slug, i)}
                >
                  <Check />
                  {isDone ? "Completed — undo" : "Mark as complete"}
                </Button>
              </li>
            );
          })}
        </ol>

        <div className="panel mt-10 p-6">
          <h2 className="text-xl font-semibold">Now make it stick</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to={m.practice.to}>{m.practice.label}</Link>
            </Button>
            <Button asChild>
              <Link to="/quiz/$topic" params={{ topic: m.slug }}>
                Take the quiz
                <ArrowRight />
              </Link>
            </Button>
            {next ? (
              <Button asChild variant="ghost">
                <Link to="/modules/$slug" params={{ slug: next.slug }}>
                  Next: {next.title}
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </>
  );
}
