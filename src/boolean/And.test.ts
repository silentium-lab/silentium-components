import { of } from "silentium";
import { expect, test, vi } from "vitest";
import { and } from "../boolean/And";

test("And.test", () => {
  const [one, oo] = of<boolean>(false);
  const [two, to] = of<boolean>(false);
  const result = and(one, two);
  const g = vi.fn();
  result(g);
  expect(g).toHaveBeenLastCalledWith(false);

  oo(true);
  to(false);
  expect(g).toHaveBeenLastCalledWith(false);

  oo(false);
  to(true);
  expect(g).toHaveBeenLastCalledWith(false);

  oo(true);
  to(true);
  expect(g).toHaveBeenLastCalledWith(true);
});
