import { late, shared } from "silentium";
import { shot } from "../behaviors/Shot";
import { expect, test, vi } from "vitest";

test("Shot._main.test", () => {
  const baseSrc = late();
  const shotSrc = late();

  const shotResult = shared(shot(baseSrc.event, shotSrc.event));
  const g = vi.fn();
  shotResult.event(g);

  baseSrc.use(1);
  shotSrc.use(1);

  expect(g).toHaveBeenLastCalledWith(1);

  baseSrc.use(2);

  expect(g).toHaveBeenLastCalledWith(1);

  shotSrc.use(1);

  expect(g).toHaveBeenLastCalledWith(2);

  const g2 = vi.fn();
  shotResult.event(g2);
  expect(g2).toHaveBeenLastCalledWith(2);
});
