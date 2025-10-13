import { Of, Primitive } from "silentium";
import { fromJson } from "../formats/FromJson";
import { expect, test } from "vitest";

test("FromJson.test", () => {
  const one = Of('{"hello": "world"}');
  const objectSync = Primitive(fromJson<{ hello: string }>(one));

  expect(objectSync.Primitive()?.hello).toBe("world");
});
