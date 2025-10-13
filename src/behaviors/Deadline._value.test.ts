import { Late, Of } from "silentium";
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
  const errorGuest = vi.fn();
  const l = Late<number>();

  setTimeout(() => {
    l.use(11);
  }, 10);

  const dl = Deadline(errorGuest, l.event, Of(200));
  const g = vi.fn();
  dl(g);

  vi.runAllTimers();

  expect(errorGuest).not.toHaveBeenCalled();
  expect(g).toHaveBeenCalledWith(11);
});
