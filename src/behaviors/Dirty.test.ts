import { I, O } from "silentium";
import { expect, test, vi } from "vitest";
import { dirty } from "../behaviors/Dirty";

test("Dirty.test", () => {
  const form = I({
    name: "one",
    surname: "two",
  });
  const [dirtyForm, dfo] = dirty(form);
  dfo.give({
    name: "new",
    surname: "two",
  });

  const g = vi.fn();
  dirtyForm.value(O(g));

  expect(g).toBeCalledWith({ name: "new" });
});
