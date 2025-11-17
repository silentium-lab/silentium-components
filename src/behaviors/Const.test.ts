import { Late, Tap } from "silentium";
import { Constant } from "../behaviors/Const";
import { expect, test } from "vitest";

test("Const.test", () => {
  const $trigger = Late(1);
  const src = Constant("val", $trigger);
  const data: string[] = [];
  src.pipe(
    Tap((v) => {
      data.push(v);
    }),
  );

  expect(data).toStrictEqual(["val"]);

  $trigger.use(1);
  $trigger.use(1);

  expect(data).toStrictEqual(["val", "val", "val"]);
});
