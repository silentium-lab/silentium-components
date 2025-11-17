import { LateShared, Tap } from "silentium";
import { expect, test, vi } from "vitest";
import { Detached } from "../behaviors/Detached";

test("Detached.test.ts", function DetachedTest() {
  const l = LateShared(1);
  const l2 = Detached(l);

  const g1 = vi.fn();
  l2.pipe(Tap(g1));

  l.use(2);

  expect(g1).toHaveBeenCalledWith(1);

  const g2 = vi.fn();
  l.pipe(Tap(g2));

  expect(g2).toHaveBeenCalledWith(2);
});
