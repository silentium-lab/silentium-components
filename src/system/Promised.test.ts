import { patron, sourceOf, sourceSync, value } from "silentium";
import { promised } from "../system/Promised";
import { expect, test, vi } from "vitest";

test("Promised.test", async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const errorSrc = sourceOf();
  value(
    errorSrc,
    patron((v) => {
      return v;
    }),
  );
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
