import { Late, Tap } from "silentium";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { Deadline } from "../behaviors/Deadline";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test("Deadline._value.test", () => {
  const error = vi.fn();
  const l = Late<number>();

  setTimeout(() => {
    l.use(11);
  }, 10);

  const dl = Deadline(Tap(error), l, 200);
  const g = vi.fn();
  dl.pipe(Tap(g));

  vi.runAllTimers();

  expect(error).not.toHaveBeenCalled();
  expect(g).toHaveBeenCalledWith(11);
});
