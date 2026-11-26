import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bar, Container, PageHeader } from "@/components/Page";
import { MODULES, TOTAL_LESSONS } from "@/data/modules";
import { useAuth } from "@/hooks/use-auth";
import { lessonKey, resetProgress, useProgress } from "@/lib/progress";
import { SITE_NAME } from "@/lib/site";

const title = `Dashboard — ${SITE_NAME}`;
const description = "Your lessons, quiz scores and what to learn next.";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { progress, ready } = useProgress();
  const { user, ready: authReady } = useAuth();

  const perModule = MODULES.map((m) => ({
    module: m,
    done: m.lessons.filter((_, i) => progress.lessons[lessonKey(m.slug, i)]).length,
  }));
  const lessonsDone = perModule.reduce((t, x) => t + x.done, 0);
  const modulesDone = perModule.filter((x) => x.done === x.module.lessons.length).length;
  const results = MODULES.flatMap((m) => {
    const r = progress.quizzes[m.slug];
    return r ? [r] : [];
  });
  const average = results.length
    ? Math.round((results.reduce((t, r) => t + r.best / r.total, 0) / results.length) * 100)
    : null;

  const nextUp = perModule.find((x) => x.done < x.module.lessons.length);
  const started = lessonsDone > 0 || results.length > 0;

  const stats = [
    { label: "Lessons completed", value: `${lessonsDone}/${TOTAL_LESSONS}` },
    { label: "Modules finished", value: `${modulesDone}/${MODULES.length}` },
    { label: "Quizzes taken", value: `${results.length}/${MODULES.length}` },
    { label: "Average best score", value: average === null ? "–" : `${average}%` },
  ];

  return (
    <>
      <PageHeader
        kicker="Dashboard"
        title={started ? "Your progress" : "Welcome to the lab"}
        intro={
          started
            ? "Pick up where you left off."
            : "Nothing here yet. Finish a lesson or take a quiz and it shows up on this page."
        }
      />
      <Container className={ready ? "" : "opacity-0"}>
        {authReady && !user ? (
          <div className="mb-8 flex flex-col gap-3 rounded-md border-[1.5px] border-dashed border-ink bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
            <p>
              <strong className="font-semibold">Progress is saved on this device only.</strong>{" "}
              <span className="text-muted-foreground">
                Sign in to keep it and see it on any device.
              </span>
            </p>
            <Button asChild variant="ink">
              <Link to="/auth">Sign in or create an account</Link>
            </Button>
          </div>
        ) : null}

        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-md border-[1.5px] border-ink bg-card p-5">
              <dt className="label-mono text-muted-foreground">{s.label}</dt>
              <dd className="mt-2 font-display text-4xl font-semibold tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>

        {nextUp ? (
          <div className="panel mt-8 flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="label-mono text-primary">{started ? "Continue" : "Start here"}</p>
              <h2 className="mt-1 text-2xl font-semibold">{nextUp.module.title}</h2>
              <p className="mt-1 text-muted-foreground">
                Lesson {nextUp.done + 1} of {nextUp.module.lessons.length}:{" "}
                {nextUp.module.lessons[nextUp.done]?.title}
              </p>
            </div>
            <Button asChild size="lg">
              <Link to="/modules/$slug" params={{ slug: nextUp.module.slug }}>
                {started ? "Continue" : "Begin"}
                <ArrowRight />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="panel mt-8 p-6">
            <h2 className="text-2xl font-semibold">Every lesson done</h2>
            <p className="mt-1 text-muted-foreground">
              Take what you know to the playground or a real dataset.
            </p>
          </div>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <section>
            <h2 className="text-2xl font-semibold">Modules</h2>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {perModule.map(({ module: m, done }) => (
                <li key={m.slug}>
                  <Link
                    to="/modules/$slug"
                    params={{ slug: m.slug }}
                    className="flex items-center gap-4 py-3.5 hover:bg-secondary/60"
                  >
                    <span className="w-6 font-mono text-sm text-primary">{m.number}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{m.title}</span>
                      <Bar value={done / m.lessons.length} className="mt-1.5 h-2" />
                    </span>
                    <span className="flex w-12 items-center justify-end gap-1 font-mono text-sm tabular-nums">
                      {done === m.lessons.length ? <Check className="size-3.5 text-success" /> : null}
                      {done}/{m.lessons.length}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Quiz scores</h2>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {MODULES.map((m) => {
                const r = progress.quizzes[m.slug];
                return (
                  <li key={m.slug}>
                    <Link
                      to="/quiz/$topic"
                      params={{ topic: m.slug }}
                      className="flex items-center gap-4 py-3.5 hover:bg-secondary/60"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{m.title}</span>
                        <span className="text-sm text-muted-foreground">
                          {r
                            ? `${r.attempts} ${r.attempts === 1 ? "attempt" : "attempts"}`
                            : "Not taken yet"}
                        </span>
                      </span>
                      <span className="font-mono text-sm tabular-nums">
                        {r ? `Best ${r.best}/${r.total}` : "Start"}
                      </span>
                      <ArrowRight className="size-4 text-muted-foreground" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {started ? (
          <div className="mt-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (window.confirm("Clear all your lessons and quiz scores? This cannot be undone."))
                  resetProgress();
              }}
            >
              Reset my progress
            </Button>
          </div>
        ) : null}
      </Container>
    </>
  );
}
