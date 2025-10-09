import { lateShared } from "silentium";
import { expect, test, vi } from "vitest";
import { detached } from "../behaviors/Detached";

test("Detached.test.ts", function DetachedTest() {
  const l = lateShared(1);
  const l2 = detached(l.value);

  l.give(2);

  const g1 = vi.fn();
  l2(g1);

  expect(g1).toHaveBeenCalledWith(1);

  const g2 = vi.fn();
  l.value(g2);

  expect(g2).toHaveBeenCalledWith(2);
});
