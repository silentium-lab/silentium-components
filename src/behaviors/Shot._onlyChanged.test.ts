import { patron, sourceOf, value } from "silentium";
import { expect, test } from "vitest";
import { onlyChanged } from "../behaviors/OnlyChanged";
import { shot } from "../behaviors/Shot";

test("Shot._onlyChanged.test", () => {
  const baseSrc = sourceOf<number>(123);
  const resultSrc = shot(baseSrc, onlyChanged(baseSrc));

  const vals: number[] = [];

  value(
    resultSrc,
    patron((v) => {
      vals.push(v);
    }),
  );

  expect(vals).toStrictEqual([]);

  baseSrc.give(222);

  expect(vals).toStrictEqual([222]);

  baseSrc.give(222);

  expect(vals).toStrictEqual([222, 222]);

  baseSrc.give(333);

  expect(vals).toStrictEqual([222, 222, 333]);

  baseSrc.give(123);

  expect(vals).toStrictEqual([222, 222, 333, 123]);
});
