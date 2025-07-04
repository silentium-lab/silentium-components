import { O, of, ownerSync, poolStateless } from "silentium";
import { expect, test, vi } from "vitest";
import { shot } from "../behaviors/Shot";

test("Shot.test", () => {
  const [baseSrc, bo] = of();
  const [shotSrc, so] = of();
  const [result, ro] = of();
  const resultSync = ownerSync(result);

  const [shotResult] = poolStateless(shot(baseSrc, shotSrc));
  shotResult.value(ro);

  bo.give(1);
  so.give(1);

  expect(resultSync.syncValue()).toBe(1);

  bo.give(2);

  expect(resultSync.syncValue()).toBe(1);

  so.give(1);

  expect(resultSync.syncValue()).toBe(2);

  const g = vi.fn();
  shotResult.value(O(g));
  expect(g).not.toBeCalled();
});
