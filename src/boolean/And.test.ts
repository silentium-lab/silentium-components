import { Late } from "silentium";
import { expect, test, vi } from "vitest";
import { and } from "../boolean/And";

test("And.test", () => {
  const one = Late<boolean>(false);
  const two = Late<boolean>(false);
  const result = and(one.event, two.event);
  const g = vi.fn();
  result(g);
  expect(g).toHaveBeenLastCalledWith(false);

  one.use(true);
  two.use(false);
  expect(g).toHaveBeenLastCalledWith(false);

  one.use(false);
  two.use(true);
  expect(g).toHaveBeenLastCalledWith(false);

  one.use(true);
  two.use(true);
  expect(g).toHaveBeenLastCalledWith(true);
});
