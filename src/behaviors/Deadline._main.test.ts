import { Late, Of, Tap } from "silentium";
import { Deadline } from "../behaviors/Deadline";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test("Deadline._main.test", () => {
  const l = Late();
  const error = vi.fn();
  const g = vi.fn();
  Deadline(Tap(error), l, Of(20)).pipe(Tap(g));

  vi.runAllTimers();

  expect(error).toHaveBeenCalledOnce();
  expect(g).not.toHaveBeenCalled();
});
