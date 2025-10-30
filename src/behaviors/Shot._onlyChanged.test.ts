import { Late, Shared, Transport } from "silentium";
import { OnlyChanged } from "../behaviors/OnlyChanged";
import { Shot } from "../behaviors/Shot";
import { expect, test } from "vitest";

test("Shot._onlyChanged.test", () => {
  const $base = Late<number>(123);
  const $shared = Shared($base, true);
  const $result = Shot($shared, OnlyChanged($shared));

  const vals: number[] = [];

  $result.event(
    Transport((v) => {
      vals.push(v);
    }),
  );

  expect(vals).toStrictEqual([]);

  $base.use(222);

  expect(vals).toStrictEqual([]);

  $base.use(222);

  expect(vals).toStrictEqual([222]);

  $base.use(333);

  expect(vals).toStrictEqual([222, 333]);

  $base.use(123);

  expect(vals).toStrictEqual([222, 333, 123]);
});
