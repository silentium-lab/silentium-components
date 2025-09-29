import { late, shared } from "silentium";
import { shot } from "../behaviors/Shot";
import { expect, test, vi } from "vitest";

test("Shot._main.test", () => {
  const baseSrc = late();
  const shotSrc = late();

  const shotResult = shared(shot(baseSrc.value, shotSrc.value));
  const g = vi.fn();
  shotResult.value(g);

  baseSrc.give(1);
  shotSrc.give(1);

  expect(g).toHaveBeenLastCalledWith(1);

  baseSrc.give(2);

  expect(g).toHaveBeenLastCalledWith(1);

  shotSrc.give(1);

  expect(g).toHaveBeenLastCalledWith(2);

  const g2 = vi.fn();
  shotResult.value(g2);
  expect(g2).toHaveBeenLastCalledWith(2);
});
