import { Of, Transport } from "silentium";
import { Template } from "../strings/Template";
import { expect, test, vi } from "vitest";

test("Template._place.test", () => {
  const t = Template();
  t.template(`<div class="greeting">Hello ${t.var(Of("User"))}</div>`);
  const g = vi.fn();
  t.to(Transport(g));

  expect(g).toHaveBeenLastCalledWith('<div class="greeting">Hello User</div>');
});
