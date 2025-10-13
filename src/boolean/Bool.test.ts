import { Of } from "silentium";
import { bool } from "../boolean/Bool";
import { expect, test, vi } from "vitest";

test("Bool.test", () => {
  const o = vi.fn();
  bool(Of(1))(o);
  expect(o).toHaveBeenCalledWith(true);
});
