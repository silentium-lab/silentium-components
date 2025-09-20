import { Late, OfFunc } from "silentium";
import { Polling } from "../behaviors/Polling";
import { Sync } from "../behaviors/Sync";
import { expect, test } from "vitest";

test("Polling.test", () => {
  const triggerSrc = new Late(1);
  let calls = 0;
  const callsSrc = new OfFunc((o) => {
    calls += 1;
    o.give(calls);
  });
  const s = new Sync(new Polling(callsSrc, triggerSrc));

  expect(s.valueSync()).toBe(1);

  triggerSrc.give(1);

  expect(s.valueSync()).toBe(2);

  triggerSrc.give(1);
  triggerSrc.give(1);
  triggerSrc.give(1);

  expect(s.valueSync()).toBe(5);
});
