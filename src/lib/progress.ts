import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export type QuizResult = { best: number; total: number; attempts: number };
export type Progress = {
  lessons: Record<string, boolean>;
  quizzes: Record<string, QuizResult>;
};

const KEY = "learnml-progress-v1";
const OWNER_KEY = "learnml-progress-owner";
const EVENT = "learnml-progress";
const EMPTY: Progress = { lessons: {}, quizzes: {} };

// Set while someone is signed in; every change is then also saved to their account.
let accountId: string | null = null;

export const lessonKey = (slug: string, index: number) => `${slug}:${index}`;

// Combines progress made before signing in with what the account already holds:
// a lesson done in either stays done, and the higher quiz score wins.
export function mergeProgress(a: Progress, b: Progress): Progress {
  const lessons: Record<string, boolean> = { ...a.lessons };
  for (const [k, v] of Object.entries(b.lessons)) if (v) lessons[k] = true;
  const quizzes: Record<string, QuizResult> = { ...a.quizzes };
  for (const [k, v] of Object.entries(b.quizzes)) {
    const prev = quizzes[k];
    quizzes[k] = prev
      ? {
          best: Math.max(prev.best, v.best),
          total: Math.max(prev.total, v.total),
          attempts: Math.max(prev.attempts, v.attempts),
        }
      : v;
  }
  return { lessons, quizzes };
}

function read(): Progress {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return { lessons: parsed.lessons ?? {}, quizzes: parsed.quizzes ?? {} };
  } catch {
    return EMPTY;
  }
}

function writeLocal(next: Progress) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage unavailable: progress simply lasts for this visit
  }
  window.dispatchEvent(new Event(EVENT));
}

async function saveToAccount(userId: string, p: Progress) {
  const { error } = await supabase.from("user_progress").upsert({
    user_id: userId,
    lessons: p.lessons as Json,
    quizzes: p.quizzes as unknown as Json,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error("Could not save progress", error.message);
}

function write(next: Progress) {
  writeLocal(next);
  if (accountId) void saveToAccount(accountId, next);
}

// Called when a session appears. Progress made as a guest is merged in once;
// after that the account copy is the source of truth on every device.
export async function connectAccount(userId: string) {
  accountId = userId;
  const { data, error } = await supabase
    .from("user_progress")
    .select("lessons, quizzes")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("Could not load progress", error.message);
    return;
  }
  const remote: Progress = {
    lessons: (data?.lessons as Record<string, boolean> | null) ?? {},
    quizzes: (data?.quizzes as unknown as Record<string, QuizResult> | null) ?? {},
  };
  let owner: string | null = null;
  try {
    owner = window.localStorage.getItem(OWNER_KEY);
  } catch {
    owner = null;
  }
  if (owner === userId) {
    writeLocal(remote);
    return;
  }
  const merged = owner ? remote : mergeProgress(remote, read());
  try {
    window.localStorage.setItem(OWNER_KEY, userId);
  } catch {
    // ignore
  }
  writeLocal(merged);
  if (!owner) await saveToAccount(userId, merged);
}

// Called on sign-out so the next person on this device starts clean.
export function disconnectAccount() {
  accountId = null;
  try {
    window.localStorage.removeItem(OWNER_KEY);
  } catch {
    // ignore
  }
  writeLocal(EMPTY);
}

export function toggleLesson(slug: string, index: number) {
  const p = read();
  const k = lessonKey(slug, index);
  write({ ...p, lessons: { ...p.lessons, [k]: !p.lessons[k] } });
}

export function recordQuiz(topic: string, score: number, total: number) {
  const p = read();
  const prev = p.quizzes[topic];
  write({
    ...p,
    quizzes: {
      ...p.quizzes,
      [topic]: {
        best: Math.max(prev?.best ?? 0, score),
        total,
        attempts: (prev?.attempts ?? 0) + 1,
      },
    },
  });
}

export function resetProgress() {
  write(EMPTY);
}

// Starts empty on the server and first render, then loads the saved progress.
export function useProgress() {
  const [progress, setProgress] = useState<Progress>(EMPTY);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => setProgress(read());
    sync();
    setReady(true);
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return { progress, ready };
}
