import { Applied, Late, Of } from "silentium";
import { expect, test, vi } from "vitest";

import { Branch } from "../behaviors/Branch";

test("Branch.branchesDontAffectResult.test", () => {
  const l = Late<number>(2);
  const el = Late<string>("else");
  const boolSync = Branch(
    Applied(l, (t) => t === 2),
    Of("then"),
    el,
  );
  const g = vi.fn();
  boolSync.then(g);

  l.use(1);
  expect(g).toHaveBeenLastCalledWith("else");

  el.use("else changed");
  // changed else source don't affect branch result
  expect(g).toHaveBeenLastCalledWith("else");
});
