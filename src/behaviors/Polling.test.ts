import { EventType, Late, Primitive } from "silentium";
import { expect, test } from "vitest";
import { polling } from "../behaviors/Polling";

test("Polling.test", () => {
  const triggerSrc = Late(1);
  let calls = 0;
  const callsSrc: EventType<number> = (o) => {
    calls += 1;
    o(calls);
  };
  const s = Primitive(polling(callsSrc, triggerSrc.event));

  expect(s.Primitive()).toBe(1);

  triggerSrc.use(1);

  expect(s.Primitive()).toBe(2);

  triggerSrc.use(1);
  triggerSrc.use(1);
  triggerSrc.use(1);

  expect(s.Primitive()).toBe(5);
});
