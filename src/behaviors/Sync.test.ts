import { Of } from "silentium";
import { expect, test } from "vitest";
import { Sync } from "./Sync";

test("Sync.test", () => {
  const o = new Of(1);
  const s = new Sync(o);

  expect(s.valueSync()).toBe(1);
});
