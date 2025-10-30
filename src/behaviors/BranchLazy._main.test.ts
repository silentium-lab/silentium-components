import { Applied, Late, Of, Transport } from "silentium";
import { BranchLazy } from "../behaviors/BranchLazy";
import { expect, test, vi } from "vitest";

test("BranchLazy._main.test", () => {
  const l = Late<number>(2);
  const res = BranchLazy(
    Applied(l, (t) => {
      return t === 2;
    }),
    () => Of("Then branch"),
    () => Of("Else branch"),
  );

  const g = vi.fn();
  res.event(Transport(g));
  expect(g).toBeCalledWith("Then branch");

  l.use(1);

  expect(g).toBeCalledWith("Else branch");
});
