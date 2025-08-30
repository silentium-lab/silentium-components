import { From, Of } from "silentium";
import { expect, test, vi } from "vitest";
import { Template } from "./Template";

test("Template._place.test", () => {
  const t = new Template();
  t.template(`<div class="greeting">Hello ${t.var(new Of("User"))}</div>`);
  const g = vi.fn();
  t.value(new From(g));

  expect(g).toHaveBeenLastCalledWith('<div class="greeting">Hello User</div>');
});
