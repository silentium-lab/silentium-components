import { Late, Shared } from "silentium";
import { expect, test } from "vitest";

import { Polling } from "../behaviors/Polling";
import { OnlyChanged } from "./OnlyChanged";

test("Polling._onlyChanged.test", () => {
  const $base = Late<number>();
  const $shared = Shared($base);
  const $result = Polling($shared, OnlyChanged($shared));

  const vals: number[] = [];

  $result.then((v) => {
    vals.push(v);
  });

  expect(vals).toStrictEqual([]);

  $base.use(123);

  expect(vals).toStrictEqual([]);

  $base.use(222);

  $base.then((v) => {
    console.log(v);
  });

  expect(vals).toStrictEqual([222]);

  $base.use(333);

  $base.then((v) => {
    console.log(v);
  });

  expect(vals).toStrictEqual([222, 333]);

  // $base.use(123);

  // expect(vals).toStrictEqual([222, 333, 123]);
});
