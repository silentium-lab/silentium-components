import { of, primitive } from "silentium";
import { expect, test } from "vitest";
import { toJson } from "../formats/ToJson";

test("ToJson.test", () => {
  const one = of({ hello: "world" });
  const objectSync = primitive(toJson(one));

  expect(objectSync.primitive()).toBe('{"hello":"world"}');
});
