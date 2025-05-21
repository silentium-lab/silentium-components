import { patron, sourceOf, sourceSync, value } from "silentium";
import { shot } from "../behaviors/Shot";
import { expect, test, vi } from "vitest";

test("Shot.test", () => {
  const baseSrc = sourceOf();
  const shotSrc = sourceOf();
  const result = sourceOf();
  const resultSync = sourceSync(result);

  const shotResult = shot(baseSrc, shotSrc);
  value(shotResult, patron(result));

  baseSrc.give(1);
  shotSrc.give(1);

  expect(resultSync.syncValue()).toBe(1);

  baseSrc.give(2);

  expect(resultSync.syncValue()).toBe(1);

  shotSrc.give(1);

  expect(resultSync.syncValue()).toBe(2);

  const g = vi.fn();
  value(shotResult, g);
  expect(g).not.toBeCalled();
});
