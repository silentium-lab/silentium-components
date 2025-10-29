import { Applied, Late, Of, Transport } from "silentium";
import { Branch } from "../behaviors/Branch";
import { expect, test, vi } from "vitest";

test("Branch.branchesDontAffectResult.test", () => {
  const l = Late<number>(2);
  const el = Late<string>("else");
  const boolSync = Branch(
    Applied(l, (t) => t === 2),
    Of("then"),
    el,
  );
  const g = vi.fn();
  boolSync.event(Transport(g));

  l.use(1);
  expect(g).toHaveBeenLastCalledWith("else");

  el.use("else changed");
  // changed else source don't affect branch result
  expect(g).toHaveBeenLastCalledWith("else");
});
