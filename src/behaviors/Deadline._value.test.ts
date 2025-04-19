import { SourceChangeable, SourceSync } from "silentium";
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
  const source = new SourceChangeable();

  setTimeout(() => {
    source.give(11);
  }, 10);
  const sync = new SourceSync(new Deadline(source, errorGuest, 200));

  vi.runAllTimers();

  expect(errorGuest).not.toHaveBeenCalled();
  expect(sync.syncValue()).toBe(11);
});
