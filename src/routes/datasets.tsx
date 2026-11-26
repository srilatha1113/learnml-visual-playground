import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Search } from "lucide-react";
import { Container, PageHeader, Segmented } from "@/components/Page";
import { DATASETS, TASKS, type Task } from "@/data/datasets";
import { SITE_NAME } from "@/lib/site";

const title = `Dataset library — ${SITE_NAME}`;
const description =
  "Classic machine learning datasets for practice: Iris, Titanic, MNIST, California Housing and more, with sizes, columns and sources.";

export const Route = createFileRoute("/datasets")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: DatasetsPage,
});

type Filter = "All" | Task;
const FILTERS: { id: Filter; name: string }[] = [
  { id: "All", name: "All" },
  ...TASKS.map((t) => ({ id: t, name: t })),
];

function DatasetsPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DATASETS.filter(
      (d) =>
        (filter === "All" || d.task === filter) &&
        (!q || `${d.name} ${d.about} ${d.target}`.toLowerCase().includes(q)),
    );
  }, [filter, query]);

  return (
    <>
      <PageHeader
        kicker="Dataset library"
        title="Well-known datasets to practise on"
        intro="Every one is free, well documented and small enough to start with today."
      />
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Segmented label="Task" options={FILTERS} value={filter} onChange={setFilter} />
          <label className="relative block md:w-72">
            <span className="sr-only">Search datasets</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search datasets"
              className="h-10 w-full rounded-md border-[1.5px] border-ink bg-card pr-3 pl-9 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
        </div>

        {shown.length === 0 ? (
          <p className="mt-10 rounded-md border-[1.5px] border-dashed border-input p-10 text-center text-muted-foreground">
            No dataset matches that search. Try a different word or choose “All”.
          </p>
        ) : (
          <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((d) => (
              <li key={d.id} className="flex flex-col rounded-md border-[1.5px] border-ink bg-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="label-mono text-primary">{d.task}</span>
                  <span className="label-mono text-muted-foreground">{d.difficulty}</span>
                </div>
                <h2 className="mt-2 text-2xl font-semibold">{d.name}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{d.about}</p>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-4 text-sm">
                  <div>
                    <dt className="label-mono text-muted-foreground">Examples</dt>
                    <dd className="font-mono">{d.rows}</dd>
                  </div>
                  <div>
                    <dt className="label-mono text-muted-foreground">Features</dt>
                    <dd className="font-mono">{d.features}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="label-mono text-muted-foreground">Predict</dt>
                    <dd>{d.target}</dd>
                  </div>
                </dl>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {d.columns.map((c) => (
                    <li key={c} className="rounded-sm bg-secondary px-2 py-0.5 font-mono text-xs">
                      {c}
                    </li>
                  ))}
                </ul>
                <a
                  href={d.source}
                  target="_blank"
                  rel="noreferrer"
                  className="label-mono mt-5 inline-flex items-center gap-1.5 text-accent hover:underline"
                >
                  Get the data
                  <ExternalLink className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
