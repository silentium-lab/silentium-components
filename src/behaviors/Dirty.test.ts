import { GuestSync, SourceChangeable } from "silentium";
import { Dirty } from "../behaviors/Dirty";
import { expect, test } from "vitest";

test("Dirty.test", () => {
  const form = new SourceChangeable({
    name: "one",
    surname: "two",
  });
  const dirtyForm = new Dirty(form);
  dirtyForm.give({
    name: "new",
    surname: "two",
  });

  const g = new GuestSync();
  dirtyForm.value(g);

  // only changed fields
  expect(g.value()).toStrictEqual({ name: "new" });
});
