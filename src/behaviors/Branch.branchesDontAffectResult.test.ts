import { applied, i, of } from "silentium";
import { expect, test, vi } from "vitest";
import { branch } from "../behaviors/Branch";

test("Branch.branchesDontAffectResult.test", () => {
  const [dti, dto] = of<number>(2);
  const [elseSrc, eo] = of<string>("else");
  const boolSync = branch(
    applied(dti, (t) => t === 2),
    i("then"),
    elseSrc,
  );
  const g = vi.fn();
  boolSync(g);

  dto(1);
  expect(g).toHaveBeenLastCalledWith("else");

  eo("else changed");
  // changed else source don't affect branch result
  expect(g).toHaveBeenLastCalledWith("else");
});
