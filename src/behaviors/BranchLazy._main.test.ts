import { Applied, Late, Of, Tap, TapMessage } from "silentium";
import { expect, test, vi } from "vitest";
import { BranchLazy } from "../behaviors/BranchLazy";

test("BranchLazy._main.test", () => {
  const l = Late<number>(2);
  const res = BranchLazy(
    Applied(l, (t) => {
      return t === 2;
    }),
    TapMessage(() => Of("Then branch")),
    TapMessage(() => Of("Else branch")),
  );

  const g = vi.fn();
  res.pipe(Tap(g));
  expect(g).toBeCalledWith("Then branch");

  l.use(1);

  expect(g).toBeCalledWith("Else branch");
});
