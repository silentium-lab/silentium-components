import { DataType, late, primitive } from "silentium";
import { expect, test } from "vitest";
import { polling } from "../behaviors/Polling";

test("Polling.test", () => {
  const triggerSrc = late(1);
  let calls = 0;
  const callsSrc: DataType<number> = (o) => {
    calls += 1;
    o(calls);
  };
  const s = primitive(polling(callsSrc, triggerSrc.value));

  expect(s.primitive()).toBe(1);

  triggerSrc.give(1);

  expect(s.primitive()).toBe(2);

  triggerSrc.give(1);
  triggerSrc.give(1);
  triggerSrc.give(1);

  expect(s.primitive()).toBe(5);
});
