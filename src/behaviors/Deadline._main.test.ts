import { late, of } from "silentium";
import { deadline } from "../behaviors/Deadline";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test("Deadline._main.test", () => {
  const l = late();
  const errorGuest = vi.fn();
  const g = vi.fn();
  deadline(errorGuest, l.event, of(20))(g);

  vi.runAllTimers();

  expect(errorGuest).toHaveBeenCalledOnce();
  expect(g).not.toHaveBeenCalled();
});
