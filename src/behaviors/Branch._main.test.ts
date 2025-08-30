import { Applied, From, Late, Of } from "silentium";
import { expect, test, vi } from "vitest";
import { Branch } from "../behaviors/Branch";

test("Branch._main.test", () => {
  const l = new Late<number>(2);
  const res = new Branch(
    new Applied(l, (t) => {
      return t === 2;
    }),
    new Of("Then ветка"),
    new Of("Else ветка"),
  );

  const g = vi.fn();
  res.value(new From(g));
  expect(g).toBeCalledWith("Then ветка");

  l.give(1);

  expect(g).toBeCalledWith("Else ветка");
});
