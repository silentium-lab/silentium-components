import { From, Late, Shared } from "silentium";
import { expect, test } from "vitest";
import { OnlyChanged } from "../behaviors/OnlyChanged";
import { Shot } from "../behaviors/Shot";

test("Shot._onlyChanged.test", () => {
  const baseSrc = new Late<number>(123);
  const sharedBase = new Shared(baseSrc, true);
  const resultSrc = new Shot(sharedBase, new OnlyChanged(sharedBase));

  const vals: number[] = [];

  resultSrc.value(
    new From((v) => {
      vals.push(v);
    }),
  );

  expect(vals).toStrictEqual([]);

  baseSrc.give(222);

  expect(vals).toStrictEqual([]);

  baseSrc.give(222);

  expect(vals).toStrictEqual([222]);

  baseSrc.give(333);

  expect(vals).toStrictEqual([222, 333]);

  baseSrc.give(123);

  expect(vals).toStrictEqual([222, 333, 123]);
});
