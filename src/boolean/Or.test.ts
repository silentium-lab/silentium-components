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

  one.owner().give(true);
  two.owner().give(false);
  expect(g).toHaveBeenLastCalledWith(true);

  one.owner().give(false);
  two.owner().give(true);
  expect(g).toHaveBeenLastCalledWith(true);

  one.owner().give(true);
  two.owner().give(true);
  expect(g).toHaveBeenLastCalledWith(true);
});
