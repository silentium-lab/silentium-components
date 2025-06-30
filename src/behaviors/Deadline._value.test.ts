import { I, O, of, ownerSync } from "silentium";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { deadline } from "../behaviors/Deadline";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test("Deadline._value.test", () => {
  const errorGuest = vi.fn();
  const [source, so] = of<number>();

  setTimeout(() => {
    so.give(11);
  }, 10);
  const sync = ownerSync(deadline(O(errorGuest), source, I(200)));

  vi.runAllTimers();

  expect(errorGuest).not.toHaveBeenCalled();
  expect(sync.syncValue()).toBe(11);
});
