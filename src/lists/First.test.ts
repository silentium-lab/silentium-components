import { i } from "silentium";
import { expect, test, vi } from "vitest";
import { first } from "./First";

test("first", () => {
  const f = first(i([1, 2, 3]));
  const g = vi.fn();
  f(g);
  expect(g).toHaveBeenCalledWith(1);
});
