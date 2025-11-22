import { Late, Of } from "silentium";
import { expect, test, vi } from "vitest";

import { Set } from "../system/Set";

test("Set.test", () => {
  const $value = Late<string>();
  const object = {
    value: "hello",
  };
  const obj = Set(Of(object), Of("value"), $value);
  const g = vi.fn();
  obj.then(g);

  expect(object.value).toBe("hello");

  $value.use("bue!");

  expect(object.value).toBe("bue!");
});
