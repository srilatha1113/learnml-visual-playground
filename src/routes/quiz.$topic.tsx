import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bar, Container } from "@/components/Page";
import { getModule } from "@/data/modules";
import { QUIZZES } from "@/data/quizzes";
import { recordQuiz } from "@/lib/progress";
import { SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quiz/$topic")({
  loader: ({ params }) => {
    const module = getModule(params.topic);
    const questions = QUIZZES[params.topic];
    if (!module || !questions?.length) throw notFound();
    return { module, questions };
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? `${loaderData.module.title} quiz — ${SITE_NAME}`
      : `Quiz — ${SITE_NAME}`;
    const description = loaderData
      ? `Test yourself on ${loaderData.module.title.toLowerCase()} with ${loaderData.questions.length} questions.`
      : "A machine learning quiz.";
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
  component: QuizPage,
});

function QuizPage() {
  const { module: m, questions } = Route.useLoaderData();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[index];
  const total = questions.length;

  const choose = (i: number) => {
    if (picked !== null || !question) return;
    setPicked(i);
    if (i === question.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= total) {
      recordQuiz(m.slug, score, total);
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setPicked(null);
    }
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  };

  return (
    <Container className="max-w-2xl">
      <Link to="/quiz" className="label-mono inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        All quizzes
      </Link>
      <h1 className="mt-4 text-3xl font-semibold md:text-4xl">{m.title}</h1>

      {finished || !question ? (
        <div className="panel mt-8 p-8 text-center">
          <p className="label-mono text-muted-foreground">Your score</p>
          <p className="mt-2 font-display text-7xl font-semibold tabular-nums">
            {score}
            <span className="text-muted-foreground">/{total}</span>
          </p>
          <p className="mt-4 text-muted-foreground">
            {score === total
              ? "Perfect. You have this one down."
              : score >= total / 2
                ? "Solid. Reread the lessons you missed and try again."
                : "Worth another pass through the module, then retake it."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={restart} variant="outline">
              <RotateCcw />
              Try again
            </Button>
            <Button asChild variant="ghost">
              <Link to="/modules/$slug" params={{ slug: m.slug }}>
                Review the module
              </Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard">
                See my dashboard
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex items-center gap-3">
            <Bar value={(index + (picked !== null ? 1 : 0)) / total} className="flex-1" />
            <span className="font-mono text-sm tabular-nums">
              {index + 1}/{total}
            </span>
          </div>

          <div className="panel mt-6 p-6">
            <h2 className="text-2xl font-semibold text-balance">{question.q}</h2>
            <ul className="mt-5 space-y-2.5">
              {question.options.map((option, i) => {
                const isAnswer = i === question.answer;
                const isPicked = i === picked;
                const revealed = picked !== null;
                return (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => choose(i)}
                      disabled={revealed}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md border-[1.5px] px-4 py-3 text-left transition-colors",
                        !revealed && "cursor-pointer border-border bg-background hover:border-ink",
                        revealed && isAnswer && "border-success bg-success/10",
                        revealed && isPicked && !isAnswer && "border-destructive bg-destructive/10",
                        revealed && !isAnswer && !isPicked && "border-border opacity-60",
                      )}
                    >
                      <span className="font-mono text-sm text-muted-foreground">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {revealed && isAnswer ? <Check className="size-4 text-success" /> : null}
                      {revealed && isPicked && !isAnswer ? (
                        <X className="size-4 text-destructive" />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>

            {picked !== null ? (
              <div className="mt-5" aria-live="polite">
                <p className="border-l-4 border-class-c bg-background px-4 py-3 text-sm">
                  <span className="label-mono mr-2 text-muted-foreground">
                    {picked === question.answer ? "Correct" : "Not quite"}
                  </span>
                  {question.why}
                </p>
                <Button className="mt-5" onClick={next}>
                  {index + 1 >= total ? "See my score" : "Next question"}
                  <ArrowRight />
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </Container>
  );
}
