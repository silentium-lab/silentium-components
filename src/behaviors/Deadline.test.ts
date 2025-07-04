import { I, O } from "silentium";
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
  const g = vi.fn();
  deadline(O(errorGuest), I(), I(20)).value(O(g));

  vi.runAllTimers();

  expect(errorGuest).toHaveBeenCalledOnce();
  expect(g).not.toHaveBeenCalled();
});
