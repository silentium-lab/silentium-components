import { Of } from "silentium";
import { template } from "../strings/Template";
import { expect, test, vi } from "vitest";

test("Template._place.test", () => {
  const t = template();
  t.template(`<div class="greeting">Hello ${t.var(Of("User"))}</div>`);
  const g = vi.fn();
  t.value(g);

  expect(g).toHaveBeenLastCalledWith('<div class="greeting">Hello User</div>');
});
