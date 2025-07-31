import { i, of } from "silentium";
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
  const [source, so] = of<number>();

  setTimeout(() => {
    so(11);
  }, 10);

  const dl = deadline(errorGuest, source, i(200));
  const g = vi.fn();
  dl(g);

  vi.runAllTimers();

  expect(errorGuest).not.toHaveBeenCalled();
  expect(g).toHaveBeenCalledWith(11);
});
