import { late } from "silentium";
import { constant } from "../behaviors/Const";
import { expect, test } from "vitest";

test("Const.test", () => {
  const triggerSrc = late(1);
  const src = constant("val", triggerSrc.value);
  const data: string[] = [];
  src((v) => {
    data.push(v);
  });

  expect(data).toStrictEqual(["val"]);

  triggerSrc.give(1);
  triggerSrc.give(1);

  expect(data).toStrictEqual(["val", "val", "val"]);
});
