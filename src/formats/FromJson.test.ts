import { of, primitive } from "silentium";
import { fromJson } from "../formats/FromJson";
import { expect, test } from "vitest";

test("FromJson.test", () => {
  const one = of('{"hello": "world"}');
  const objectSync = primitive(fromJson<{ hello: string }>(one));

  expect(objectSync.primitive()?.hello).toBe("world");
});
