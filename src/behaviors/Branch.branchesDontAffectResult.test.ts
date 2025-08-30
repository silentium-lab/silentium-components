import { Applied, From, Late, Of } from "silentium";
import { expect, test, vi } from "vitest";
import { Branch } from "../behaviors/Branch";

test("Branch.branchesDontAffectResult.test", () => {
  const l = new Late<number>(2);
  const el = new Late<string>("else");
  const boolSync = new Branch(
    new Applied(l, (t) => t === 2),
    new Of("then"),
    el,
  );
  const g = vi.fn();
  boolSync.value(new From(g));

  l.give(1);
  expect(g).toHaveBeenLastCalledWith("else");

  el.give("else changed");
  // changed else source don't affect branch result
  expect(g).toHaveBeenLastCalledWith("else");
});
