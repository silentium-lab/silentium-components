import { Of } from "silentium";
import { describe, expect, test, vi } from "vitest";

import { Record } from "../structures";
import { Template } from "./Template";

describe("Template.test", () => {
  test("regular usage", () => {
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

  test("without messages", () => {
    const tpl = Template("<h1>$1</h1>", {
      $1: "one value",
    });
    const g = vi.fn();
    tpl.then(g);

    expect(g).toHaveBeenLastCalledWith("<h1>one value</h1>");
  });

  test("with template as function", () => {
    const tpl = Template((t) => `<h1>${t.var(Of("one value"))}</h1>`);
    const g = vi.fn();
    tpl.then(g);

    expect(g).toHaveBeenLastCalledWith("<h1>one value</h1>");
  });

  test("with template as function with many vars", () => {
    const tpl = Template(
      (t) =>
        `<h1>${t.var(Of("one"))}, ${t.var(Of("two"))}, ${t.var(Of("three"))}, ${t.var(Of("four"))}, ${t.var(Of("five"))}, ${t.var(Of("six"))}, ${t.var(Of("seven"))}, ${t.var(Of("eight"))}, ${t.var(Of("nine"))}, ${t.var(Of("ten"))}, ${t.var(Of("eleven"))}, ${t.var(Of("twelve"))}, ${t.var(Of("thirteen"))}, ${t.var(Of("fourteen"))}, ${t.var(Of("fifteen"))}, ${t.var(Of("seventeen"))}, ${t.var(Of("eighteen"))}, ${t.var(Of("nineteen"))}, ${t.var(Of("twenty"))}, ${t.var(Of("twenty one"))}, ${t.var(Of("twenty two"))}, ${t.var(Of("twenty three"))}, ${t.var(Of("twenty four"))}, ${t.var(Of("twenty five"))}, ${t.var(Of("twenty six"))}, ${t.var(Of("twenty seven"))}</h1>`,
    );
    const g = vi.fn();
    tpl.then(g);

    expect(g).toHaveBeenLastCalledWith(
      "<h1>one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen, fourteen, fifteen, seventeen, eighteen, nineteen, twenty, twenty one, twenty two, twenty three, twenty four, twenty five, twenty six, twenty seven</h1>",
    );
  });

  test("with places", () => {
    const t = Template();
    t.template(`<div class="greeting">Hello ${t.var(Of("User"))}</div>`);
    const g = vi.fn();
    t.then(g);

    expect(g).toHaveBeenLastCalledWith(
      '<div class="greeting">Hello User</div>',
    );
  });

  test("number variable", () => {
    const t = Template();
    t.template(`<div class="greeting">Hello ${t.var(Of(123))}</div>`);
    const g = vi.fn();
    t.then(g);

    expect(g).toHaveBeenLastCalledWith(
      '<div class="greeting">Hello User</div>',
    );
  });
});
