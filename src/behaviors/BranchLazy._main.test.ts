import { applied, late, of } from "silentium";
import { branchLazy } from "../behaviors/BranchLazy";
import { expect, test, vi } from "vitest";

test("BranchLazy._main.test", () => {
  const l = late<number>(2);
  const res = branchLazy(
    applied(l.value, (t) => {
      return t === 2;
    }),
    () => of("Then branch"),
    () => of("Else branch"),
  );

  const g = vi.fn();
  res(g);
  expect(g).toBeCalledWith("Then branch");

  l.give(1);

  expect(g).toBeCalledWith("Else branch");
});
