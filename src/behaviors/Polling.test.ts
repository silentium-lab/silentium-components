import { EventType, late, primitive } from "silentium";
import { expect, test } from "vitest";
import { polling } from "../behaviors/Polling";

test("Polling.test", () => {
  const triggerSrc = late(1);
  let calls = 0;
  const callsSrc: EventType<number> = (o) => {
    calls += 1;
    o(calls);
  };
  const s = primitive(polling(callsSrc, triggerSrc.event));

  expect(s.primitive()).toBe(1);

  triggerSrc.use(1);

  expect(s.primitive()).toBe(2);

  triggerSrc.use(1);
  triggerSrc.use(1);
  triggerSrc.use(1);

  expect(s.primitive()).toBe(5);
});
