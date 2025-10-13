import { Late } from "silentium";
import { dirty } from "../behaviors/Dirty";
import { expect, test, vi } from "vitest";

test("Dirty.test", () => {
  const form = Late({
    name: "one",
    surname: "two",
  });
  const d = dirty(form.event);
  const g = vi.fn();
  d.event(g);

  d.use({
    name: "new",
    surname: "two",
  });

  expect(g).toBeCalledWith({ name: "new" });
});
