import { O, of, poolStateless } from "silentium";
import { expect, test } from "vitest";
import { onlyChanged } from "../behaviors/OnlyChanged";
import { shot } from "../behaviors/Shot";

test("Shot._onlyChanged.test", () => {
  const [baseSrc, bo] = of<number>(123);
  const [sharedBase] = poolStateless(baseSrc);
  const resultSrc = shot(sharedBase, onlyChanged(sharedBase));

  const vals: number[] = [];

  resultSrc.value(
    O((v) => {
      vals.push(v);
    }),
  );

  expect(vals).toStrictEqual([]);

  bo.give(222);

  expect(vals).toStrictEqual([]);

  bo.give(222);

  expect(vals).toStrictEqual([222]);

  bo.give(333);

  expect(vals).toStrictEqual([222, 333]);

  bo.give(123);

  expect(vals).toStrictEqual([222, 333, 123]);
});
