import { From, Late, Of } from "silentium";
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
  const l = new Late<number>();

  setTimeout(() => {
    l.owner().give(11);
  }, 10);

  const dl = new Deadline(new From(errorGuest), l, new Of(200));
  const g = vi.fn();
  dl.value(new From(g));

  vi.runAllTimers();

  expect(errorGuest).not.toHaveBeenCalled();
  expect(g).toHaveBeenCalledWith(11);
});
