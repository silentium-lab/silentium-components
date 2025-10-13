import { EventType, Late, Primitive } from "silentium";
import { expect, test } from "vitest";
import { Polling } from "../behaviors/Polling";

test("Polling.test", () => {
  const triggerSrc = Late(1);
  let calls = 0;
  const callsSrc: EventType<number> = (o) => {
    calls += 1;
    o(calls);
  };
  const s = Primitive(Polling(callsSrc, triggerSrc.event));

  expect(s.primitive()).toBe(1);

  triggerSrc.use(1);

  expect(s.primitive()).toBe(2);

  triggerSrc.use(1);
  triggerSrc.use(1);
  triggerSrc.use(1);

  expect(s.primitive()).toBe(5);
});
