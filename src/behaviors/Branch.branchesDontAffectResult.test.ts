import { sourceApplied, sourceOf, sourceSync } from "silentium";
import { expect, test } from "vitest";
import { branch } from "../behaviors/Branch";

test("Branch.branchesDontAffectResult.test", () => {
  const deliveryTypeSrc = sourceOf<number>(2);
  const elseSrc = sourceOf<string>("else");
  const thenSrc = sourceOf("then");
  const boolSync = sourceSync(
    branch(
      sourceApplied(deliveryTypeSrc, (t) => t === 2),
      thenSrc,
      elseSrc,
    ),
  );

  deliveryTypeSrc.give(1);
  expect(boolSync.syncValue()).toBe("else");

  elseSrc.give("else changed");
  // changed else source don't affect branch result
  expect(boolSync.syncValue()).toBe("else");
});
