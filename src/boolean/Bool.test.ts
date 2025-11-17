import { Of, Tap } from "silentium";
import { Bool } from "../boolean/Bool";
import { expect, test, vi } from "vitest";

test("Bool.test", () => {
  const o = vi.fn();
  Bool(Of(1)).pipe(Tap(o));
  expect(o).toHaveBeenCalledWith(true);
});
