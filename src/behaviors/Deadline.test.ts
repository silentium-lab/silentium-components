import { give, GuestType } from "silentium";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { Deadline } from "../behaviors/Deadline";

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
  new Deadline(source(100), errorGuest, 20).value(g);

  vi.runAllTimers();

  expect(errorGuest).toHaveBeenCalledOnce();
  expect(g).not.toHaveBeenCalled();
});
