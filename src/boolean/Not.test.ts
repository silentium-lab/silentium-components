import { late } from "silentium";
import { not } from "../boolean/Not";
import { expect, test, vi } from "vitest";

test("Not.test", () => {
  const one = late<boolean>(false);
  const result = not(one.value);
  const g = vi.fn();
  result(g);
  expect(g).toHaveBeenLastCalledWith(true);

  one.give(true);
  expect(g).toHaveBeenLastCalledWith(false);
});
