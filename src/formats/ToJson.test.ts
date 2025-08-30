import { Of } from "silentium";
import { expect, test } from "vitest";
import { Sync } from "../behaviors/Sync";
import { ToJson } from "../formats/ToJson";

test("ToJson.test", () => {
  const one = new Of({ hello: "world" });
  const objectSync = new Sync(new ToJson(one));

  expect(objectSync.valueSync()).toBe('{"hello":"world"}');
});
