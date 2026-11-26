import type { PointerEvent } from "react";

// Pointer position inside a square SVG plot as data coordinates in [0, 1], y pointing up.
export function plotPoint(e: PointerEvent<SVGSVGElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  return { x: clamp((e.clientX - r.left) / r.width), y: clamp(1 - (e.clientY - r.top) / r.height) };
}

export const CLASS_FILL = [
  "fill-class-a",
  "fill-class-b",
  "fill-class-c",
  "fill-class-d",
  "fill-success",
  "fill-foreground",
] as const;
export const CLASS_STROKE = [
  "stroke-class-a",
  "stroke-class-b",
  "stroke-class-c",
  "stroke-class-d",
  "stroke-success",
  "stroke-foreground",
] as const;
export const CLASS_BG = [
  "bg-class-a",
  "bg-class-b",
  "bg-class-c",
  "bg-class-d",
  "bg-success",
  "bg-foreground",
] as const;
