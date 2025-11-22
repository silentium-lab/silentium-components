import { Late, Shared } from "silentium";
import { expect, test } from "vitest";

import { OnlyChanged } from "../behaviors/OnlyChanged";
import { Shot } from "../behaviors/Shot";

test("Shot._onlyChanged.test", () => {
  const $base = Late<number>();
  const $shared = Shared($base);
  const $result = Shot($shared, OnlyChanged($shared));

  const vals: number[] = [];

  $result.then((v) => {
    vals.push(v);
  });

  expect(vals).toStrictEqual([]);

  $base.use(123);

  expect(vals).toStrictEqual([]);

  $base.use(222);

  expect(vals).toStrictEqual([222]);

  $base.use(333);

  expect(vals).toStrictEqual([222, 333]);

  $base.use(123);

  expect(vals).toStrictEqual([222, 333, 123]);
});
