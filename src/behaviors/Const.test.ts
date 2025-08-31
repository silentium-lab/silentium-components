import { From, Late } from "silentium";
import { expect, test } from "vitest";
import { Const } from "../behaviors/Const";

test("Const.test", () => {
  const triggerSrc = new Late(1);
  const src = new Const("val", triggerSrc);
  const data: string[] = [];
  src.value(
    new From((v) => {
      data.push(v);
    }),
  );

  expect(data).toStrictEqual(["val"]);

  triggerSrc.give(1);
  triggerSrc.give(1);

  expect(data).toStrictEqual(["val", "val", "val"]);
});
