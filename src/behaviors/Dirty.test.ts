import { i } from "silentium";
import { expect, test, vi } from "vitest";
import { dirty } from "../behaviors/Dirty";

test("Dirty.test", () => {
  const form = i({
    name: "one",
    surname: "two",
  });
  const [dirtyForm, dfo] = dirty(form);
  dfo({
    name: "new",
    surname: "two",
  });

  const g = vi.fn();
  dirtyForm(g);

  expect(g).toBeCalledWith({ name: "new" });
});
