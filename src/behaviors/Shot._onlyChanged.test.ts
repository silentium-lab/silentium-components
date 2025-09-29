import { late, shared } from "silentium";
import { onlyChanged } from "../behaviors/OnlyChanged";
import { shot } from "../behaviors/Shot";
import { expect, test } from "vitest";

test("Shot._onlyChanged.test", () => {
  const baseSrc = late<number>(123);
  const sharedBase = shared(baseSrc.value, true);
  const resultSrc = shot(sharedBase.value, onlyChanged(sharedBase.value));

  const vals: number[] = [];

  resultSrc((v) => {
    vals.push(v);
  });

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
