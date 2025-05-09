import { patron, sourceOf, value } from "silentium";
import { fork } from "../behaviors/Fork";
import { expect, test, vitest } from "vitest";

test("Fork._noElse.test", () => {
  const deliveryTypeSrc = sourceOf<number>(2);
  const forkSrc = fork(deliveryTypeSrc, (type) => type === 2, "Then ветка");

  const g1 = vitest.fn();
  value(forkSrc, patron(g1));
  expect(g1).toHaveBeenCalledWith("Then ветка");

  deliveryTypeSrc.give(1);

  const g2 = vitest.fn();
  value(forkSrc, patron(g2));
  expect(g2).not.toHaveBeenCalled();
});
