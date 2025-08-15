import { of } from "silentium";
import { expect, test, vi } from "vitest";
import { or } from "../boolean/Or";

test("Or.test", () => {
  const [one, oo] = of<boolean>(false);
  const [two, to] = of<boolean>(false);
  const result = or(one, two);
  const g = vi.fn();
  result(g);
  expect(g).toHaveBeenLastCalledWith(false);

  oo(true);
  to(false);
  expect(g).toHaveBeenLastCalledWith(true);

  oo(false);
  to(true);
  expect(g).toHaveBeenLastCalledWith(true);

  oo(true);
  to(true);
  expect(g).toHaveBeenLastCalledWith(true);
});
