import { of } from "silentium";
import { expect, test, vi } from "vitest";
import { not } from "../boolean/Not";

test("Not.test", () => {
  const [one, oo] = of<boolean>(false);
  const result = not(one);
  const g = vi.fn();
  result(g);
  expect(g).toHaveBeenLastCalledWith(true);

  oo(true);
  expect(g).toHaveBeenLastCalledWith(false);
});
