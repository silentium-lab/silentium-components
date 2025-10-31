import { Of, Transport } from "silentium";
import { Template } from "../strings/Template";
import { RecordOf } from "../structures";
import { expect, test, vi } from "vitest";

test("Template._main.test", () => {
  const tpl = Template(
    Of("<h1>$1</h1>"),
    RecordOf({
      $1: Of("one value"),
    }),
  );
  const g = vi.fn();
  tpl.event(Transport(g));

  expect(g).toHaveBeenLastCalledWith("<h1>one value</h1>");

  const tpl2 = Template(
    Of("<h2>$1</h2>"),
    RecordOf({
      $1: Of("second value"),
    }),
  );
  const g2 = vi.fn();
  tpl2.event(Transport(g2));

  expect(g2).toHaveBeenLastCalledWith("<h2>second value</h2>");
});
