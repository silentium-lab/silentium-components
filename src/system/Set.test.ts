import { i, of } from "silentium";
import { expect, test, vi } from "vitest";
import { set } from "../system/Set";

test("Set.test", () => {
  const [value, o] = of<string>();
  const object = {
    value: "hello",
  };
  const obj = set(i(object), i("value"), value);
  const g = vi.fn();
  obj(g);

  expect(object.value).toBe("hello");

  o("bue!");

  expect(object.value).toBe("bue!");
});
