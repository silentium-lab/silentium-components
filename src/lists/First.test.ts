import { Of, Tap } from "silentium";
import { expect, test, vi } from "vitest";
import { First } from "./First";

test("first", () => {
  const f = First(Of([1, 2, 3]));
  const g = vi.fn();
  f.pipe(Tap(g));
  expect(g).toHaveBeenCalledWith(1);
});
