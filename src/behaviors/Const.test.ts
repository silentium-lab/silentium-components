import { Late } from "silentium";
import { expect, test } from "vitest";

import { Constant } from "../behaviors/Const";

test("Const.test", () => {
  const $trigger = Late(1);
  const src = Constant("val", $trigger);
  const data: string[] = [];
  src.then((v) => {
    data.push(v);
  });

  expect(data).toStrictEqual(["val"]);

  $trigger.use(NaN);
  $trigger.use(NaN);

  expect(data).toStrictEqual(["val", "val", "val"]);
});
