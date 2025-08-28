import { Applied, From, Late, Lazy, Of } from "silentium";
import { expect, test, vi } from "vitest";
import { BranchLazy } from "../behaviors/BranchLazy";

test("BranchLazy._main.test", () => {
  const l = new Late<number>(2);
  const res = new BranchLazy(
    new Applied(l, (t) => {
      return t === 2;
    }),
    new Lazy(() => new Of("Then ветка")),
    new Lazy(() => new Of("Else ветка")),
  );

  const g = vi.fn();
  res.value(new From(g));
  expect(g).toBeCalledWith("Then ветка");

  l.owner().give(1);

  expect(g).toBeCalledWith("Else ветка");
});
