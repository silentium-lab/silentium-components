import { Any, From, Late, Shared } from "silentium";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { Tick } from "../behaviors/Tick";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test("Tick.test", async () => {
  const s1 = new Late<number>(1);
  const s2 = new Late<number>(2);
  const tickSrc = new Shared(new Tick(new Any(s1, s2)), true);

  const g = vi.fn();
  tickSrc.value(new From(g));

  s1.owner().give(3);
  s2.owner().give(4);

  await vi.advanceTimersByTimeAsync(10);
  vi.runAllTicks();

  expect(g).toBeCalledTimes(1);
  expect(g).toHaveBeenLastCalledWith(4);
});
