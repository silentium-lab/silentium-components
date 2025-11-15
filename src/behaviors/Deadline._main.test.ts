import { Late, Of, Transport } from "silentium";
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
  const error = vi.fn();
  const g = vi.fn();
  Deadline(Transport(error), l, Of(20)).to(Transport(g));

  vi.runAllTimers();

  expect(error).toHaveBeenCalledOnce();
  expect(g).not.toHaveBeenCalled();
});
