import { Late } from "silentium";
import { Not } from "../boolean/Not";
import { expect, test, vi } from "vitest";

test("Not.test", () => {
  const one = Late<boolean>(false);
  const result = Not(one.event);
  const g = vi.fn();
  result(g);
  expect(g).toHaveBeenLastCalledWith(true);

  one.use(true);
  expect(g).toHaveBeenLastCalledWith(false);
});
