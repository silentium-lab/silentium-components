import { Of, Primitive } from "silentium";
import { expect, test } from "vitest";
import { toJson } from "../formats/ToJson";

test("ToJson.test", () => {
  const one = Of({ hello: "world" });
  const objectSync = Primitive(toJson(one));

  expect(objectSync.Primitive()).toBe('{"hello":"world"}');
});
