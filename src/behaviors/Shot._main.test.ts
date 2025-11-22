import { Late, Shared } from "silentium";
import { expect, test, vi } from "vitest";

import { Shot } from "../behaviors/Shot";

test("Shot._main.test", () => {
  const $base = Late();
  const $trigger = Late();

  const $shotted = Shared(Shot($base, $trigger));
  const g = vi.fn();
  $shotted.then(g);

  $base.use(1);
  $trigger.use(1);

  expect(g).toHaveBeenLastCalledWith(1);

  $base.use(2);

  expect(g).toHaveBeenLastCalledWith(1);

  $trigger.use(1);

  expect(g).toHaveBeenLastCalledWith(2);

  const g2 = vi.fn();
  $shotted.then(g2);
  expect(g2).toHaveBeenLastCalledWith(2);
});
