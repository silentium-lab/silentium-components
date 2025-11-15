import { Late, Transport } from "silentium";
import { expect, test, vi } from "vitest";
import { And } from "../boolean/And";

test("And.test", () => {
  const $one = Late<boolean>(false);
  const $two = Late<boolean>(false);
  const result = And($one, $two);
  const g = vi.fn();
  result.to(Transport(g));
  expect(g).toHaveBeenLastCalledWith(false);

  $one.use(true);
  $two.use(false);
  expect(g).toHaveBeenLastCalledWith(false);

  $one.use(false);
  $two.use(true);
  expect(g).toHaveBeenLastCalledWith(false);

  $one.use(true);
  $two.use(true);
  expect(g).toHaveBeenLastCalledWith(true);
});
