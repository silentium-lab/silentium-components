import { applied, late, of } from "silentium";
import { branch } from "../behaviors/Branch";
import { expect, test, vi } from "vitest";

test("Branch._main.test", () => {
  const l = late<number>(2);
  const res = branch(
    applied(l.event, (t) => {
      return t === 2;
    }),
    of("Then ветка"),
    of("Else ветка"),
  );

  const g = vi.fn();
  res(g);
  expect(g).toBeCalledWith("Then ветка");

  l.use(1);

  expect(g).toBeCalledWith("Else ветка");
});
