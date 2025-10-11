import { late } from "silentium";
import { constant } from "../behaviors/Const";
import { expect, test } from "vitest";

test("Const.test", () => {
  const triggerSrc = late(1);
  const src = constant("val", triggerSrc.event);
  const data: string[] = [];
  src((v) => {
    data.push(v);
  });

  expect(data).toStrictEqual(["val"]);

  triggerSrc.use(1);
  triggerSrc.use(1);

  expect(data).toStrictEqual(["val", "val", "val"]);
});
