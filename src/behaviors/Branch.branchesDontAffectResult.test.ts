import { applied, late, of } from "silentium";
import { branch } from "../behaviors/Branch";
import { expect, test, vi } from "vitest";

test("Branch.branchesDontAffectResult.test", () => {
  const l = late<number>(2);
  const el = late<string>("else");
  const boolSync = branch(
    applied(l.event, (t) => t === 2),
    of("then"),
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
