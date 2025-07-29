import { applied, i, of } from "silentium";
import { expect, test, vi } from "vitest";
import { branch } from "../behaviors/Branch";

test("Branch.test", () => {
  const [dts, dto] = of<number>(2);
  const res = branch(
    applied(dts, (t) => {
      return t === 2;
    }),
    i("Then ветка"),
    i("Else ветка"),
  );

  const g = vi.fn();
  res(g);
  expect(g).toBeCalledWith("Then ветка");

  dto(1);

  expect(g).toBeCalledWith("Else ветка");
});
