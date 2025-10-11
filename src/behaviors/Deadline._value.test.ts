import { late, of } from "silentium";
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
  const l = late<number>();

  setTimeout(() => {
    l.use(11);
  }, 10);

  const dl = deadline(errorGuest, l.event, of(200));
  const g = vi.fn();
  dl(g);

  vi.runAllTimers();

  expect(errorGuest).not.toHaveBeenCalled();
  expect(g).toHaveBeenCalledWith(11);
});
