import { From, Late } from "silentium";
import { expect, test, vi } from "vitest";
import { Or } from "../boolean/Or";

test("Or.test", () => {
  const one = new Late<boolean>(false);
  const two = new Late<boolean>(false);
  const result = new Or(one, two);
  const g = vi.fn();
  result.value(new From(g));
  expect(g).toHaveBeenLastCalledWith(false);

  one.give(true);
  two.give(false);
  expect(g).toHaveBeenLastCalledWith(true);

  one.give(false);
  two.give(true);
  expect(g).toHaveBeenLastCalledWith(true);

  one.give(true);
  two.give(true);
  expect(g).toHaveBeenLastCalledWith(true);
});
