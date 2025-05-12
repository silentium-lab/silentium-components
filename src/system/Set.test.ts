import { sourceOf, sourceSync } from "silentium";
import { set } from "../system/Set";
import { expect, test } from "vitest";

test("Set.test", () => {
  const value = sourceOf();
  const object = sourceSync(
    set(
      {
        value: "hello",
      },
      "value",
      value,
    ),
  );

  expect(object.syncValue().value).toBe("hello");

  value.give("bue!");

  expect(object.syncValue().value).toBe("bue!");
});
