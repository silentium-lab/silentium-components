import { Late, Message, MessageType, Primitive } from "silentium";
import { expect, test } from "vitest";

import { Polling } from "../behaviors/Polling";

test("Polling.test", () => {
  const $trigger = Late(1);
  let calls = 0;
  const $calls: MessageType<number> = Message((r) => {
    calls += 1;
    r(calls);
  });
  const s = Primitive(Polling($calls, $trigger));

  expect(s.primitive()).toBe(1);

  $trigger.use(NaN);

  expect(s.primitive()).toBe(2);

  $trigger.use(NaN);
  $trigger.use(NaN);
  $trigger.use(NaN);

  expect(s.primitive()).toBe(5);
});
