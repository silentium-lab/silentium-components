import { Of, Primitive } from "silentium";
import { FromJson } from "../formats/FromJson";
import { expect, test } from "vitest";

test("FromJson.test", () => {
  const one = Of('{"hello": "world"}');
  const objectSync = Primitive(FromJson<{ hello: string }>(one));

  expect(objectSync.primitive()?.hello).toBe("world");
});
