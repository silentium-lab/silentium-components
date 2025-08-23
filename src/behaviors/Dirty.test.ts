import { From, Late } from "silentium";
import { expect, test, vi } from "vitest";
import { Dirty } from "../behaviors/Dirty";

test("Dirty.test", () => {
  const form = new Late({
    name: "one",
    surname: "two",
  });
  const d = new Dirty(form);
  const g = vi.fn();
  d.value(new From(g));

  d.owner().give({
    name: "new",
    surname: "two",
  });

  expect(g).toBeCalledWith({ name: "new" });
});
