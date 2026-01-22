import { Late, Message, MessageType, Primitive, Shared } from "silentium";
import { expect, test, vi } from "vitest";

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

test("Polling.repeatedValue", () => {
  const $trigger = Late(1);
  const $base: MessageType<number> = Message((r) => {
    r(42);
  });
  const $polling = Polling($base, $trigger);
  const $shared = Shared($polling);

  const subscriber = vi.fn();
  $shared.then(subscriber);

  expect(subscriber).toHaveBeenCalledTimes(1);
  expect(subscriber).toHaveBeenCalledWith(42);

  $trigger.use(NaN);

  expect(subscriber).toHaveBeenCalledTimes(2);
  expect(subscriber).toHaveBeenCalledWith(42);

  $trigger.use(NaN);

  expect(subscriber).toHaveBeenCalledTimes(3);
  expect(subscriber).toHaveBeenCalledWith(42);
});
