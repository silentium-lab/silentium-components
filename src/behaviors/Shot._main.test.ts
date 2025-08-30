import { From, Late, Shared } from "silentium";
import { expect, test, vi } from "vitest";
import { Shot } from "../behaviors/Shot";

test("Shot._main.test", () => {
  const baseSrc = new Late();
  const shotSrc = new Late();

  const shotResult = new Shared(new Shot(baseSrc, shotSrc));
  const g = vi.fn();
  shotResult.value(new From(g));

  baseSrc.give(1);
  shotSrc.give(1);

  expect(g).toHaveBeenLastCalledWith(1);

  baseSrc.give(2);

  expect(g).toHaveBeenLastCalledWith(1);

  shotSrc.give(1);

  expect(g).toHaveBeenLastCalledWith(2);

  const g2 = vi.fn();
  shotResult.value(new From(g2));
  expect(g2).toHaveBeenLastCalledWith(2);
});
