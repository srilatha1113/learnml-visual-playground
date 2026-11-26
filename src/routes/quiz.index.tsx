import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Container, PageHeader } from "@/components/Page";
import { MODULES } from "@/data/modules";
import { QUIZZES } from "@/data/quizzes";
import { useProgress } from "@/lib/progress";
import { SITE_NAME } from "@/lib/site";

const title = `Quiz — ${SITE_NAME}`;
const description =
  "Short machine learning quizzes for every module, with an explanation after each answer.";

export const Route = createFileRoute("/quiz/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: QuizIndex,
});

function QuizIndex() {
  const { progress } = useProgress();
  return (
    <>
      <PageHeader
        kicker="Quiz"
        title="Check what stuck"
        intro="One short quiz per module. Every answer comes with an explanation, and you can retake them as often as you like."
      />
      <Container>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => {
            const result = progress.quizzes[m.slug];
            const count = QUIZZES[m.slug]?.length ?? 0;
            return (
              <li key={m.slug}>
                <Link
                  to="/quiz/$topic"
                  params={{ topic: m.slug }}
                  className="group flex h-full flex-col rounded-md border-[1.5px] border-ink bg-card p-5 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-stamp"
                >
                  <span className="font-mono text-sm text-primary">{m.number}</span>
                  <h2 className="mt-2 flex-1 text-xl font-semibold">{m.title}</h2>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="label-mono text-muted-foreground">
                      {result ? `Best ${result.best}/${result.total}` : `${count} questions`}
                    </span>
                    <span className="label-mono flex items-center gap-1.5">
                      {result ? "Retake" : "Start"}
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </>
  );
}
