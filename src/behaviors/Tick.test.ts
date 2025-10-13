import { Any, Late, Shared } from "silentium";
import { Tick } from "../behaviors/Tick";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test("Tick.test", async () => {
  const s1 = Late<number>(1);
  const s2 = Late<number>(2);
  const tickSrc = Shared(Tick(Any(s1.event, s2.event)), true);

  const g = vi.fn();
  tickSrc.event(g);

  s1.use(3);
  s2.use(4);

  await vi.advanceTimersByTimeAsync(10);
  vi.runAllTicks();

  expect(g).toBeCalledTimes(1);
  expect(g).toHaveBeenLastCalledWith(4);
});
