import { From, Of } from "silentium";
import { expect, test, vi } from "vitest";
import { First } from "./First";

test("first", () => {
  const f = new First(new Of([1, 2, 3]));
  const g = vi.fn();
  f.value(new From(g));
  expect(g).toHaveBeenCalledWith(1);
});
