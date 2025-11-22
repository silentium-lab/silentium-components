import { Late } from "silentium";
import { expect, test, vi } from "vitest";

import { Dirty } from "../behaviors/Dirty";

test("Dirty.test", () => {
  const form = Late({
    name: "one",
    surname: "two",
  });
  const d = Dirty(form);
  const g = vi.fn();
  d.then(g);

  d.use({
    name: "new",
    surname: "two",
  });

  expect(g).toBeCalledWith({ name: "new" });
});
