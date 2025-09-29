import { any, late, shared } from "silentium";
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
  const s1 = late<number>(1);
  const s2 = late<number>(2);
  const tickSrc = shared(tick(any(s1.value, s2.value)), true);

  const g = vi.fn();
  tickSrc.value(g);

  s1.give(3);
  s2.give(4);

  await vi.advanceTimersByTimeAsync(10);
  vi.runAllTicks();

  expect(g).toBeCalledTimes(1);
  expect(g).toHaveBeenLastCalledWith(4);
});
