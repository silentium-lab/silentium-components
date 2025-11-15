import { Applied, Late, Of, Transport } from "silentium";
import { Branch } from "../behaviors/Branch";
import { expect, test, vi } from "vitest";

test("Branch._main.test", () => {
  const l = Late<number>(2);
  const res = Branch(
    Applied(l, (t) => {
      return t === 2;
    }),
    Of("Then ветка"),
    Of("Else ветка"),
  );

  const g = vi.fn();
  res.to(Transport(g));
  expect(g).toBeCalledWith("Then ветка");

  l.use(1);

  expect(g).toBeCalledWith("Else ветка");
});
