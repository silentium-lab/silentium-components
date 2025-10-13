import { Late, Of } from "silentium";
import { Deadline } from "../behaviors/Deadline";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test("Deadline._main.test", () => {
  const l = Late();
  const errorGuest = vi.fn();
  const g = vi.fn();
  Deadline(errorGuest, l.event, Of(20))(g);

  vi.runAllTimers();

  expect(errorGuest).toHaveBeenCalledOnce();
  expect(g).not.toHaveBeenCalled();
});
