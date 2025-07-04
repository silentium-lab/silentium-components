import { applied, I, of, ownerSync } from "silentium";
import { expect, test } from "vitest";
import { branch } from "../behaviors/Branch";

test("Branch.branchesDontAffectResult.test", () => {
  const [dti, dto] = of<number>(2);
  const [elseSrc, eo] = of<string>("else");
  const boolSync = ownerSync(
    branch(
      applied(dti, (t) => t === 2),
      I("then"),
      elseSrc,
    ),
  );

  dto.give(1);
  expect(boolSync.syncValue()).toBe("else");

  eo.give("else changed");
  // changed else source don't affect branch result
  expect(boolSync.syncValue()).toBe("else");
});
