import { patron, sourceAny, sourceOf, sourceSync, value } from "silentium";
import { tick } from "../behaviors/Tick";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test("Tick.test", async () => {
  const s1 = sourceOf<number>(1);
  const s2 = sourceOf<number>(2);
  const tickSrc = sourceSync(tick(sourceAny([s1, s2])));

  const g = vi.fn();
  value(tickSrc, patron(g));

  s1.give(3);
  s2.give(4);

  await vi.advanceTimersByTimeAsync(10);
  vi.runAllTicks();

  expect(g).toBeCalledTimes(1);
  expect(g).toBeCalledWith(4);
});
