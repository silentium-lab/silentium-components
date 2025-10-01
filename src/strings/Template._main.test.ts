import { of } from "silentium";
import { template } from "../strings/Template";
import { recordOf } from "../structures";
import { expect, test, vi } from "vitest";

test("Template._main.test", () => {
  const tpl = template(
    of("<h1>$1</h1>"),
    recordOf({
      $1: of("one value"),
    }),
  );
  const g = vi.fn();
  tpl.value(g);

  expect(g).toHaveBeenLastCalledWith("<h1>one value</h1>");

  const tpl2 = template(
    of("<h2>$1</h2>"),
    recordOf({
      $1: of("second value"),
    }),
  );
  const g2 = vi.fn();
  tpl2.value(g2);

  expect(g2).toHaveBeenLastCalledWith("<h2>second value</h2>");
});
