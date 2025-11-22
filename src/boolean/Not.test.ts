import { Late } from "silentium";
import { expect, test, vi } from "vitest";

import { Not } from "../boolean/Not";

test("Not.test", () => {
  const one = Late<boolean>(false);
  const result = Not(one);
  const g = vi.fn();
  result.then(g);
  expect(g).toHaveBeenLastCalledWith(true);

  one.use(true);
  expect(g).toHaveBeenLastCalledWith(false);
});
