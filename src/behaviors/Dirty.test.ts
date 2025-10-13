import { Late } from "silentium";
import { Dirty } from "../behaviors/Dirty";
import { expect, test, vi } from "vitest";

test("Dirty.test", () => {
  const form = Late({
    name: "one",
    surname: "two",
  });
  const d = Dirty(form.event);
  const g = vi.fn();
  d.event(g);

  d.use({
    name: "new",
    surname: "two",
  });

  expect(g).toBeCalledWith({ name: "new" });
});
