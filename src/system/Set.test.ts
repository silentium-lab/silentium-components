import { From, Late, Of } from "silentium";
import { Set } from "../system/Set";
import { expect, test, vi } from "vitest";

test("Set.test", () => {
  const value = new Late<string>();
  const object = {
    value: "hello",
  };
  const obj = new Set(new Of(object), new Of("value"), value);
  const g = vi.fn();
  obj.value(new From(g));

  expect(object.value).toBe("hello");

  value.give("bue!");

  expect(object.value).toBe("bue!");
});
