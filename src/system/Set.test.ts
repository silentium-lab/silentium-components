import { I, of, ownerSync } from "silentium";
import { expect, test } from "vitest";
import { set } from "../system/Set";

test("Set.test", () => {
  const [value, o] = of<string>();
  const object = {
    value: "hello",
  };
  const obj = ownerSync<typeof object>(
    set(I(object), I("value"), value),
    object,
  );

  expect(obj.syncValue().value).toBe("hello");

  o.give("bue!");

  expect(obj.syncValue().value).toBe("bue!");
});
