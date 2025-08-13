import { of } from "silentium";
import { expect, test, vi } from "vitest";
import { shot } from "../behaviors/Shot";

test("Shot.test", () => {
  const [baseSrc, bo] = of();
  const [shotSrc, so] = of();

  const shotResult = shot(baseSrc, shotSrc);
  const g = vi.fn();
  shotResult(g);

  bo(1);
  so(1);

  expect(g).toHaveBeenLastCalledWith(1);

  bo(2);

  expect(g).toHaveBeenLastCalledWith(1);

  so(1);

  expect(g).toHaveBeenLastCalledWith(2);

  const g2 = vi.fn();
  shotResult(g2);
  expect(g2).toHaveBeenLastCalledWith(2);
});
