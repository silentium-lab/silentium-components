import { Late, Shared, Transport } from "silentium";
import { Shot } from "../behaviors/Shot";
import { expect, test, vi } from "vitest";

test("Shot._main.test", () => {
  const $base = Late();
  const $trigger = Late();

  const $shotted = Shared(Shot($base, $trigger));
  const g = vi.fn();
  $shotted.to(Transport(g));

  $base.use(1);
  $trigger.use(1);

  expect(g).toHaveBeenLastCalledWith(1);

  $base.use(2);

  expect(g).toHaveBeenLastCalledWith(1);

  $trigger.use(1);

  expect(g).toHaveBeenLastCalledWith(2);

  const g2 = vi.fn();
  $shotted.to(Transport(g2));
  expect(g2).toHaveBeenLastCalledWith(2);
});
