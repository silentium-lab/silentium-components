import { late } from "silentium";
import { dirty } from "../behaviors/Dirty";
import { expect, test, vi } from "vitest";

test("Dirty.test", () => {
  const form = late({
    name: "one",
    surname: "two",
  });
  const d = dirty(form.value);
  const g = vi.fn();
  d.value(g);

  d.give({
    name: "new",
    surname: "two",
  });

  expect(g).toBeCalledWith({ name: "new" });
});
