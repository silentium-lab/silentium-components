import { late, shared } from "silentium";
import { onlyChanged } from "../behaviors/OnlyChanged";
import { shot } from "../behaviors/Shot";
import { expect, test } from "vitest";

test("Shot._onlyChanged.test", () => {
  const baseSrc = late<number>(123);
  const sharedBase = shared(baseSrc.event, true);
  const resultSrc = shot(sharedBase.event, onlyChanged(sharedBase.event));

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
