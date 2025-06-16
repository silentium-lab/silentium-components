import { patron, sourceApplied, sourceOf, sourceSync, value } from "silentium";
import { expect, test } from "vitest";
import { branch } from "../behaviors/Branch";

test("Branch.test", () => {
  const deliveryTypeSrc = sourceOf<number>(2);
  const boolSync = sourceSync(
    value(
      branch(
        sourceApplied(deliveryTypeSrc, (t) => t === 2),
        "Then ветка",
        "Else ветка",
      ),
      patron((v) => {
        return v;
      }),
    ),
  );

  expect(boolSync.syncValue()).toBe("Then ветка");

  deliveryTypeSrc.give(1);

  expect(boolSync.syncValue()).toBe("Else ветка");
});
