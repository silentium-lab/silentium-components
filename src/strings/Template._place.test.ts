import { Of } from "silentium";
import { expect, test, vi } from "vitest";

import { Template } from "../strings/Template";

test("Template._place.test", () => {
  const t = Template();
  t.template(`<div class="greeting">Hello ${t.var(Of("User"))}</div>`);
  const g = vi.fn();
  t.then(g);

  expect(g).toHaveBeenLastCalledWith('<div class="greeting">Hello User</div>');
});
