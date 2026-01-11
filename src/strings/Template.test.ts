import { Of } from "silentium";
import { describe, expect, test, vi } from "vitest";

import { Branch } from "../behaviors";
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
    const tpl = Template((t) => `<h1>${t.raw(Of("one value"))}</h1>`);
    const g = vi.fn();
    tpl.then(g);

    expect(g).toHaveBeenLastCalledWith("<h1>one value</h1>");
  });

  test("with template as function with many vars", () => {
    const tpl = Template(
      (t) =>
        `<h1>${t.raw(Of("one"))}, ${t.raw(Of("two"))}, ${t.raw(Of("three"))}, ${t.raw(Of("four"))}, ${t.raw(Of("five"))}, ${t.raw(Of("six"))}, ${t.raw(Of("seven"))}, ${t.raw(Of("eight"))}, ${t.raw(Of("nine"))}, ${t.raw(Of("ten"))}, ${t.raw(Of("eleven"))}, ${t.raw(Of("twelve"))}, ${t.raw(Of("thirteen"))}, ${t.raw(Of("fourteen"))}, ${t.raw(Of("fifteen"))}, ${t.raw(Of("seventeen"))}, ${t.raw(Of("eighteen"))}, ${t.raw(Of("nineteen"))}, ${t.raw(Of("twenty"))}, ${t.raw(Of("twenty one"))}, ${t.raw(Of("twenty two"))}, ${t.raw(Of("twenty three"))}, ${t.raw(Of("twenty four"))}, ${t.raw(Of("twenty five"))}, ${t.raw(Of("twenty six"))}, ${t.raw(Of("twenty seven"))}</h1>`,
    );
    const g = vi.fn();
    tpl.then(g);

    expect(g).toHaveBeenLastCalledWith(
      "<h1>one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen, fourteen, fifteen, seventeen, eighteen, nineteen, twenty, twenty one, twenty two, twenty three, twenty four, twenty five, twenty six, twenty seven</h1>",
    );
  });

  test("with places", () => {
    const t = Template();
    t.template(`<div class="greeting">Hello ${t.raw(Of("User"))}</div>`);
    const g = vi.fn();
    t.then(g);

    expect(g).toHaveBeenLastCalledWith(
      '<div class="greeting">Hello User</div>',
    );
  });

  test("number variable", () => {
    const t = Template();
    t.template(`<div class="greeting">Hello ${t.raw(Of(123))}</div>`);
    const g = vi.fn();
    t.then(g);

    expect(g).toHaveBeenLastCalledWith('<div class="greeting">Hello 123</div>');
  });

  test("number escaped variable", () => {
    const t = Template();
    t.template(`<div class="greeting">Hello ${t.escaped(Of(123))}</div>`);
    const g = vi.fn();
    t.then(g);

    expect(g).toHaveBeenLastCalledWith('<div class="greeting">Hello 123</div>');
  });

  test("empty string variable", () => {
    const t = Template();
    t.template(`<div class="greeting">Hello ${t.raw(Of(""))}</div>`);
    const g = vi.fn();
    t.then(g);

    expect(g).toHaveBeenLastCalledWith('<div class="greeting">Hello </div>');
  });

  test("Branched string variable", async () => {
    const t = Template(
      (t) =>
        `<div class="greeting">Hello ${t.raw(Branch(false, "true", ""))}</div>`,
    );

    expect(await t).toBe('<div class="greeting">Hello </div>');
  });

  test("escaped method with no special characters", () => {
    const tpl = Template((t) => `<div>${t.escaped(Of("Hello world"))}</div>`);
    const g = vi.fn();
    tpl.then(g);

    expect(g).toHaveBeenLastCalledWith("<div>Hello world</div>");
  });

  test("escaped method with all escape characters", () => {
    const tpl = Template((t) => `<div>${t.escaped(Of("&<>\"'/"))}</div>`);
    const g = vi.fn();
    tpl.then(g);

    expect(g).toHaveBeenLastCalledWith(
      `<div>&amp;&lt;&gt;&quot;&#x27;&#x2F;</div>`,
    );
  });
});
