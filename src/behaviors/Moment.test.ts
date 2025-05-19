import { patron, sourceOf, sourceSync, value } from "silentium";
import { moment } from "../behaviors/Moment";
import { expect, test } from "vitest";

test("Moment.test", () => {
  const src = sourceOf<number>(1);
  const srcMoment = sourceSync(moment(src));
  let counter = 0;
  value(
    srcMoment,
    patron(() => {
      counter += 1;
    }),
  );

  src.give(2);
  src.give(3);
  src.give(4);
  src.give(5);
  src.give(6);

  expect(srcMoment.syncValue()).toBe(1);
  expect(counter).toBe(1);
});
