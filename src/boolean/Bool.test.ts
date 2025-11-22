import { Of } from "silentium";
import { expect, test, vi } from "vitest";

import { Bool } from "../boolean/Bool";

test("Bool.test", () => {
  const o = vi.fn();
  Bool(Of(1)).then(o);
  expect(o).toHaveBeenCalledWith(true);
});
