import { guestSync, sourceOf } from "silentium";
import { expect, test } from "vitest";
import { dirty } from "../behaviors/Dirty";

test("Dirty.test", () => {
  const form = sourceOf({
    name: "one",
    surname: "two",
  });
  const dirtyForm = dirty(form);
  dirtyForm.give({
    name: "new",
    surname: "two",
  });

  const g = guestSync();
  dirtyForm.value(g);

  // only changed fields
  expect(g.value()).toStrictEqual({ name: "new" });
});
