import { Late } from "silentium";
import { expect, test } from "vitest";

import { MergeAccumulation } from "../behaviors/MergeAccumulation";

test("MergeAccumulation.test", async () => {
  const baseSrc = Late<any>({
    one: 1,
  });
  const accumulation = MergeAccumulation(baseSrc);

  baseSrc.use({
    two: 2,
  });

  expect(await accumulation).toStrictEqual({
    one: 1,
    two: 2,
  });

  baseSrc.use({
    three: 3,
  });

  expect(await accumulation).toStrictEqual({
    one: 1,
    two: 2,
    three: 3,
  });
});
