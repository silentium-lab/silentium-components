import { Of, Transport } from "silentium";
import { Bool } from "../boolean/Bool";
import { expect, test, vi } from "vitest";

test("Bool.test", () => {
  const o = vi.fn();
  Bool(Of(1)).event(Transport(o));
  expect(o).toHaveBeenCalledWith(true);
});
