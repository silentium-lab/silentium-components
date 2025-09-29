import { late } from "silentium";
import { expect, test, vi } from "vitest";
import { and } from "../boolean/And";

test("And.test", () => {
  const one = late<boolean>(false);
  const two = late<boolean>(false);
  const result = and(one.value, two.value);
  const g = vi.fn();
  result(g);
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
