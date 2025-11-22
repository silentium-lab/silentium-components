import { Late, Of } from "silentium";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { Deadline } from "../behaviors/Deadline";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test("Deadline._main.test", () => {
  const $l = Late();
  const error = vi.fn();
  const g = vi.fn();
  Deadline($l, Of(20)).then(g).catch(error);

  vi.runAllTimers();

  expect(error).toHaveBeenCalledOnce();
  expect(g).not.toHaveBeenCalled();
});
