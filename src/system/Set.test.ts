import { Late, Of, Transport } from "silentium";
import { Set } from "../system/Set";
import { expect, test, vi } from "vitest";

test("Set.test", () => {
  const $value = Late<string>();
  const object = {
    value: "hello",
  };
  const obj = Set(Of(object), Of("value"), $value);
  const g = vi.fn();
  obj.to(Transport(g));

  expect(object.value).toBe("hello");

  $value.use("bue!");

  expect(object.value).toBe("bue!");
});
