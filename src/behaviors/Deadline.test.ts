import { give, GuestType, value } from "silentium";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { deadline } from "../behaviors/Deadline";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test("Deadline.test", () => {
  const errorGuest = vi.fn();
  const source = (after: number) => (g: GuestType<number>) => {
    setTimeout(() => {
      give(42, g);
    }, after);
  };
  const g = vi.fn();
  value(deadline(errorGuest, source(100), 20), g);

  vi.runAllTimers();

  expect(errorGuest).toHaveBeenCalledOnce();
  expect(g).not.toHaveBeenCalled();
});
