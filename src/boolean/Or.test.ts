import { late } from "silentium";
import { or } from "../boolean/Or";
import { expect, test, vi } from "vitest";

test("Or.test", () => {
  const one = late<boolean>(false);
  const two = late<boolean>(false);
  const result = or(one.event, two.event);
  const g = vi.fn();
  result(g);
  expect(g).toHaveBeenLastCalledWith(false);

  one.use(true);
  two.use(false);
  expect(g).toHaveBeenLastCalledWith(true);

  one.use(false);
  two.use(true);
  expect(g).toHaveBeenLastCalledWith(true);

  one.use(true);
  two.use(true);
  expect(g).toHaveBeenLastCalledWith(true);
});
