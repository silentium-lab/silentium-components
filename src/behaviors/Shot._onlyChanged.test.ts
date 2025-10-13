import { Late, Shared } from "silentium";
import { OnlyChanged } from "../behaviors/OnlyChanged";
import { Shot } from "../behaviors/Shot";
import { expect, test } from "vitest";

test("Shot._onlyChanged.test", () => {
  const baseSrc = Late<number>(123);
  const sharedBase = Shared(baseSrc.event, true);
  const resultSrc = Shot(sharedBase.event, OnlyChanged(sharedBase.event));

  const vals: number[] = [];

  resultSrc((v) => {
    vals.push(v);
  });

  expect(vals).toStrictEqual([]);

  baseSrc.use(222);

  expect(vals).toStrictEqual([]);

  baseSrc.use(222);

  expect(vals).toStrictEqual([222]);

  baseSrc.use(333);

  expect(vals).toStrictEqual([222, 333]);

  baseSrc.use(123);

  expect(vals).toStrictEqual([222, 333, 123]);
});
