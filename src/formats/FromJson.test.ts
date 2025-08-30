import { Of } from "silentium";
import { expect, test } from "vitest";
import { Sync } from "../behaviors/Sync";
import { FromJson } from "../formats/FromJson";

test("FromJson.test", () => {
  const one = new Of('{"hello": "world"}');
  const objectSync = new Sync(new FromJson<{ hello: string }>(one));

  expect(objectSync.valueSync().hello).toBe("world");
});
