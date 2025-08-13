import { of, sharedStateless } from "silentium";
import { expect, test } from "vitest";
import { onlyChanged } from "../behaviors/OnlyChanged";
import { shot } from "../behaviors/Shot";

test("Shot._onlyChanged.test", () => {
  const [baseSrc, bo] = of<number>(123);
  const [sharedBase] = sharedStateless(baseSrc);
  const resultSrc = shot(sharedBase, onlyChanged(sharedBase));

  const vals: number[] = [];

  resultSrc((v) => {
    vals.push(v);
  });

  expect(vals).toStrictEqual([]);

  bo(222);

  expect(vals).toStrictEqual([]);

  bo(222);

  expect(vals).toStrictEqual([222]);

  bo(333);

  expect(vals).toStrictEqual([222, 333]);

  bo(123);

  expect(vals).toStrictEqual([222, 333, 123]);
});
