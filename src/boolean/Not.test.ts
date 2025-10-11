import { late } from "silentium";
import { not } from "../boolean/Not";
import { expect, test, vi } from "vitest";

test("Not.test", () => {
  const one = late<boolean>(false);
  const result = not(one.event);
  const g = vi.fn();
  result(g);
  expect(g).toHaveBeenLastCalledWith(true);

  one.use(true);
  expect(g).toHaveBeenLastCalledWith(false);
});
