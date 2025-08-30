import { From, Late } from "silentium";
import { expect, test, vi } from "vitest";
import { And } from "../boolean/And";

test("And.test", () => {
  const one = new Late<boolean>(false);
  const two = new Late<boolean>(false);
  const result = new And(one, two);
  const g = vi.fn();
  result.value(new From(g));
  expect(g).toHaveBeenLastCalledWith(false);

  one.give(true);
  two.give(false);
  expect(g).toHaveBeenLastCalledWith(false);

  one.give(false);
  two.give(true);
  expect(g).toHaveBeenLastCalledWith(false);

  one.give(true);
  two.give(true);
  expect(g).toHaveBeenLastCalledWith(true);
});
