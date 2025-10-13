import { Applied, Late, Of } from "silentium";
import { Branch } from "../behaviors/Branch";
import { expect, test, vi } from "vitest";

test("Branch.branchesDontAffectResult.test", () => {
  const l = Late<number>(2);
  const el = Late<string>("else");
  const boolSync = Branch(
    Applied(l.event, (t) => t === 2),
    Of("then"),
    el.event,
  );
  const g = vi.fn();
  boolSync(g);

  l.use(1);
  expect(g).toHaveBeenLastCalledWith("else");

  el.use("else changed");
  // changed else source don't affect branch result
  expect(g).toHaveBeenLastCalledWith("else");
});
