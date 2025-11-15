import { Applied, Late, Of, Transport, TransportMessage } from "silentium";
import { expect, test, vi } from "vitest";
import { BranchLazy } from "../behaviors/BranchLazy";

test("BranchLazy._main.test", () => {
  const l = Late<number>(2);
  const res = BranchLazy(
    Applied(l, (t) => {
      return t === 2;
    }),
    TransportMessage(() => Of("Then branch")),
    TransportMessage(() => Of("Else branch")),
  );

  const g = vi.fn();
  res.to(Transport(g));
  expect(g).toBeCalledWith("Then branch");

  l.use(1);

  expect(g).toBeCalledWith("Else branch");
});
