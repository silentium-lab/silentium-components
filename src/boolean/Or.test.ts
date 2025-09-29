import { late } from "silentium";
import { or } from "../boolean/Or";
import { expect, test, vi } from "vitest";

test("Or.test", () => {
  const one = late<boolean>(false);
  const two = late<boolean>(false);
  const result = or(one.value, two.value);
  const g = vi.fn();
  result(g);
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
