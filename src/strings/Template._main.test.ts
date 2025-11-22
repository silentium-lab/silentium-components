import { Of } from "silentium";
import { expect, test, vi } from "vitest";

import { Template } from "../strings/Template";
import { Record } from "../structures";

test("Template._main.test", () => {
  const tpl = Template(
    Of("<h1>$1</h1>"),
    Record({
      $1: Of("one value"),
    }),
  );
  const g = vi.fn();
  tpl.then(g);

  expect(g).toHaveBeenLastCalledWith("<h1>one value</h1>");

  const tpl2 = Template(
    Of("<h2>$1</h2>"),
    Record({
      $1: Of("second value"),
    }),
  );
  const g2 = vi.fn();
  tpl2.then(g2);

  expect(g2).toHaveBeenLastCalledWith("<h2>second value</h2>");
});
