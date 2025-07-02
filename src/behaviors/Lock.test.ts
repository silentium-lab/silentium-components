import { of, ownerSync, pool } from "silentium";
import { expect, test } from "vitest";
import { lock } from "../behaviors/Lock";

test("Lock.test", () => {
  const [source, so] = of<number>(1);
  const [lockSrc, lo] = of<boolean>(false);

  const [lockedSrc] = pool(lock(source, lockSrc));
  const lockedSync = ownerSync(lockedSrc);

  expect(lockedSync.syncValue()).toBe(1);

  so.give(2);

  expect(lockedSync.syncValue()).toBe(2);

  lo.give(true);
  so.give(3);
  so.give(4);
  so.give(5);

  expect(lockedSync.syncValue()).toBe(2);

  lo.give(false);
  so.give(6);
  expect(lockedSync.syncValue()).toBe(6);
});
