import { Late, Transport } from "silentium";
import { Or } from "../boolean/Or";
import { expect, test, vi } from "vitest";

test("Or.test", () => {
  const one = Late<boolean>(false);
  const two = Late<boolean>(false);
  const result = Or(one, two);
  const g = vi.fn();
  result.to(Transport(g));
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
