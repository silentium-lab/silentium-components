import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { Deadline } from "../behaviors/Deadline";
import { From, Late, Of } from "silentium";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test("Deadline._main.test", () => {
  const l = new Late();
  const errorGuest = vi.fn();
  const g = vi.fn();
  new Deadline(new From(errorGuest), l, new Of(20)).value(new From(g));

  vi.runAllTimers();

  expect(errorGuest).toHaveBeenCalledOnce();
  expect(g).not.toHaveBeenCalled();
});
