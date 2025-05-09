import { sourceOf, sourceSync } from "silentium";
import { fork } from "../behaviors/Fork";
import { expect, test } from "vitest";

test("Fork.test", () => {
  const deliveryTypeSrc = sourceOf<number>(2);
  const forkSrc = sourceSync(
    fork(deliveryTypeSrc, (type) => type === 2, "Then ветка", "Else ветка"),
  );

  expect(forkSrc.syncValue()).toBe("Then ветка");

  deliveryTypeSrc.give(1);

  expect(forkSrc.syncValue()).toBe("Else ветка");
});
