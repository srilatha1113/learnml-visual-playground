import { describe, expect, it } from "vitest";
import { mergeProgress } from "./progress";

describe("merging guest progress into an account", () => {
  it("keeps a lesson completed on either side", () => {
    const merged = mergeProgress(
      { lessons: { "foundations:0": true }, quizzes: {} },
      { lessons: { "clustering:1": true, "foundations:2": false }, quizzes: {} },
    );
    expect(merged.lessons).toEqual({ "foundations:0": true, "clustering:1": true });
  });

  it("keeps the higher quiz score", () => {
    const merged = mergeProgress(
      { lessons: {}, quizzes: { clustering: { best: 2, total: 4, attempts: 1 } } },
      { lessons: {}, quizzes: { clustering: { best: 4, total: 4, attempts: 3 } } },
    );
    expect(merged.quizzes["clustering"]).toEqual({ best: 4, total: 4, attempts: 3 });
  });
});
