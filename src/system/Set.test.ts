import { late, of } from "silentium";
import { set } from "../system/Set";
import { expect, test, vi } from "vitest";

test("Set.test", () => {
  const value = late<string>();
  const object = {
    value: "hello",
  };
  const obj = set(of(object), of("value"), value.event);
  const g = vi.fn();
  obj(g);

  expect(object.value).toBe("hello");

  value.use("bue!");

  expect(object.value).toBe("bue!");
});
