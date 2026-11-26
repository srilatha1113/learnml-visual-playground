import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  kicker,
  title,
  intro,
  children,
}: {
  kicker: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <div className="border-b-[1.5px] border-ink bg-grid">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <p className="label-mono text-primary">{kicker}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-balance md:text-5xl">{title}</h1>
        {intro ? <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{intro}</p> : null}
        {children}
      </div>
    </div>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto max-w-6xl px-4 py-10 md:px-6", className)}>{children}</div>;
}

export function Bar({ value, className }: { value: number; className?: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-2.5 overflow-hidden rounded-full border border-ink bg-card", className)}
    >
      <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Field({
  label,
  value,
  children,
}: {
  label: string;
  value?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-2">
        <span className="label-mono text-muted-foreground">{label}</span>
        {value !== undefined ? <span className="font-mono text-sm">{value}</span> : null}
      </span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

export function Readout({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-sm border border-border bg-background px-3 py-2">
      <div className="label-mono text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-mono text-lg tabular-nums">{value}</div>
    </div>
  );
}

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; name: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={String(o.id)}
          type="button"
          aria-pressed={o.id === value}
          onClick={() => onChange(o.id)}
          className={cn(
            "cursor-pointer rounded-sm border-[1.5px] px-2.5 py-1 text-sm transition-colors",
            o.id === value
              ? "border-ink bg-ink text-ink-foreground"
              : "border-border bg-card hover:border-ink",
          )}
        >
          {o.name}
        </button>
      ))}
    </div>
  );
}

export function Sparkline({ values, className }: { values: number[]; className?: string }) {
  const finite = values.filter((v) => Number.isFinite(v));
  const max = Math.max(...finite, 1e-9);
  const n = values.length;
  const d = values
    .map((v, i) => {
      const x = n > 1 ? (i / (n - 1)) * 100 : 0;
      const y = 38 - (Math.min(Number.isFinite(v) ? v : max, max) / max) * 36;
      return `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className={cn("h-16 w-full", className)}>
      <line x1="0" y1="38" x2="100" y2="38" className="stroke-border" strokeWidth="0.5" />
      {n > 1 ? (
        <path d={d} className="fill-none stroke-primary" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      ) : null}
    </svg>
  );
}
