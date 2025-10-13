import { Late } from "silentium";
import { Constant } from "../behaviors/Const";
import { expect, test } from "vitest";

test("Const.test", () => {
  const triggerSrc = Late(1);
  const src = Constant("val", triggerSrc.event);
  const data: string[] = [];
  src((v) => {
    data.push(v);
  });

  expect(data).toStrictEqual(["val"]);

  triggerSrc.use(1);
  triggerSrc.use(1);

  expect(data).toStrictEqual(["val", "val", "val"]);
});
