import { sourceApplied, sourceOf, sourceSync } from "silentium";
import { expect, test, vi } from "vitest";
import { branch } from "../behaviors/Branch";

test("Branch.dontRespondAfterRespond.test", () => {
  const deliveryTypeSrc = sourceOf<number>(1);
  const thenSrc = sourceOf<any>("then");
  const boolSync = sourceSync(
    branch(
      sourceApplied(deliveryTypeSrc, (t) => t === 2),
      thenSrc,
    ),
  );

  deliveryTypeSrc.give(2);
  expect(boolSync.syncValue()).toBe("then");

  deliveryTypeSrc.give(1);
  const g = vi.fn();
  boolSync.value(g);
  expect(g).not.toHaveBeenCalled();

  deliveryTypeSrc.give(2);
  const g1 = vi.fn();
  boolSync.value(g1);
  expect(g1).toHaveBeenCalledWith("then");

  deliveryTypeSrc.give(3);
  const g2 = vi.fn();
  boolSync.value(g2);
  expect(g2).not.toHaveBeenCalled();
});
