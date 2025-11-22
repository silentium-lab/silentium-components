import { Applied, Late, Of } from "silentium";
import { expect, test, vi } from "vitest";

import { Branch } from "../behaviors/Branch";

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
  res.then(g);
  expect(g).toBeCalledWith("Then ветка");

  l.use(1);

  expect(g).toBeCalledWith("Else ветка");
});
