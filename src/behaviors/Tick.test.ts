import { any, O, of, ownerSync, poolStateless } from "silentium";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { tick } from "../behaviors/Tick";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test("Tick.test", async () => {
  const [s1, s1o] = of<number>(1);
  const [s2, s2o] = of<number>(2);
  const [tickSrc] = poolStateless(tick(any(s1, s2)));
  const tickSync = ownerSync(tickSrc);

  const g = vi.fn();
  tickSrc.value(O(g));

  s1o.give(3);
  s2o.give(4);

  await vi.advanceTimersByTimeAsync(10);
  vi.runAllTicks();

  expect(g).toBeCalledTimes(1);
  expect(tickSync.syncValue()).toBe(4);
});
