import { From, Late } from "silentium";
import { expect, test, vi } from "vitest";
import { Not } from "../boolean/Not";

test("Not.test", () => {
  const one = new Late<boolean>(false);
  const result = new Not(one);
  const g = vi.fn();
  result.value(new From(g));
  expect(g).toHaveBeenLastCalledWith(true);

  one.give(true);
  expect(g).toHaveBeenLastCalledWith(false);
});
