import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { deadline } from "../behaviors/Deadline";
import { i, of } from "silentium";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test("Deadline.test", () => {
  const [oi] = of();
  const errorGuest = vi.fn();
  const g = vi.fn();
  deadline(errorGuest, oi, i(20))(g);

  vi.runAllTimers();

  expect(errorGuest).toHaveBeenCalledOnce();
  expect(g).not.toHaveBeenCalled();
});
