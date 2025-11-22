import { Of, Primitive } from "silentium";
import { expect, test } from "vitest";

import { FromJson } from "../formats/FromJson";

test("FromJson.test", () => {
  const one = Of('{"hello": "world"}');
  const objectSync = Primitive(FromJson<{ hello: string }>(one));

  expect(objectSync.primitive()?.hello).toBe("world");
});
