import { sourceOf, sourceSync, value } from "silentium";
import { expect, test, vi } from "vitest";
import { lock } from "../behaviors/Lock";

test("Lock.test", () => {
  const source = sourceOf<number>(1);
  const lockSrc = sourceOf();

  const lockedSrc = lock(source, lockSrc);
  const lockedSync = sourceSync(lockedSrc);

  expect(lockedSync.syncValue()).toBe(1);

  source.give(2);

  expect(lockedSync.syncValue()).toBe(2);

  lockSrc.give(1);
  source.give(3);
  source.give(4);
  source.give(5);

  const g = vi.fn();
  value(lockedSrc, g);
  expect(g).not.toBeCalled();
});
