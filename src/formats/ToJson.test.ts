import { Of, Primitive } from "silentium";
import { expect, test } from "vitest";
import { ToJson } from "../formats/ToJson";

test("ToJson.test", () => {
  const one = Of({ hello: "world" });
  const objectSync = Primitive(ToJson(one));

  expect(objectSync.primitive()).toBe('{"hello":"world"}');
});
