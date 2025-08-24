import { Late } from "silentium";
import { expect, test } from "vitest";
import { Sync } from "../behaviors/Sync";
import { ToJson } from "../formats/ToJson";

test("FromJson.test", () => {
  const one = new Late({ hello: "world" });
  const objectSync = new Sync(new ToJson(one));

  expect(objectSync.valueSync()).toBe('{"hello":"world"}');
});
