import { sourceOf, sourceSync } from "silentium";
import { expect, test, vi } from "vitest";
import { promised } from "../system/Promised";

test("Promised.test", async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const errorSrc = sourceOf();
  const p = sourceSync(promised(Promise.resolve(111), errorSrc));
  await vi.advanceTimersByTime(10);

  expect(p.syncValue()).toBe(111);

  const failedP = sourceSync(promised(Promise.reject("test"), errorSrc));
  await vi.advanceTimersByTime(10);

  expect(() => failedP.syncValue()).toThrowError();
  await vi.advanceTimersByTime(10);

  expect(sourceSync(errorSrc).syncValue()).toBe("test");
  vi.useRealTimers();
});
