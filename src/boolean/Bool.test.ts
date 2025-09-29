import { of } from "silentium";
import { bool } from "../boolean/Bool";
import { expect, test, vi } from "vitest";

test("Bool.test", () => {
  const o = vi.fn();
  bool(of(1))(o);
  expect(o).toHaveBeenCalledWith(true);
});
