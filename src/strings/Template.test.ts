import { From, Of } from "silentium";
import { expect, test, vi } from "vitest";
import { Template } from "../strings/Template";
import { RecordOf } from "../structures";

test("Template.test", () => {
  const tpl = new Template(
    "<h1>$1</h1>",
    new RecordOf({
      $1: new Of("one value"),
    }),
  );
  const g = vi.fn();
  tpl.value(new From(g));

  expect(g).toHaveBeenLastCalledWith("<h1>one value</h1>");

  const tpl2 = new Template(
    new Of("<h2>$1</h2>"),
    new RecordOf({
      $1: new Of("second value"),
    }),
  );
  const g2 = vi.fn();
  tpl2.value(new From(g2));

  expect(g2).toHaveBeenLastCalledWith("<h2>second value</h2>");
});
