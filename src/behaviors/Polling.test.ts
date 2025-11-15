import { Late, Message, MessageType, Primitive } from "silentium";
import { expect, test } from "vitest";
import { Polling } from "../behaviors/Polling";

test("Polling.test", () => {
  const $trigger = Late(1);
  let calls = 0;
  const $calls: MessageType<number> = Message((o) => {
    calls += 1;
    o.use(calls);
  });
  const s = Primitive(Polling($calls, $trigger));

  expect(s.primitive()).toBe(1);

  $trigger.use(1);

  expect(s.primitive()).toBe(2);

  $trigger.use(1);
  $trigger.use(1);
  $trigger.use(1);

  expect(s.primitive()).toBe(5);
});
