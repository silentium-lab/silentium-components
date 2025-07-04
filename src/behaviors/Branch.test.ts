import { applied, I, of, ownerSync } from "silentium";
import { expect, test } from "vitest";
import { branch } from "../behaviors/Branch";

test("Branch.test", () => {
  const [dts, dto] = of<number>(2);
  const boolSync = ownerSync(
    branch(
      applied(dts, (t) => {
        return t === 2;
      }),
      I("Then ветка"),
      I("Else ветка"),
    ),
  );

  expect(boolSync.syncValue()).toBe("Then ветка");

  dto.give(1);

  expect(boolSync.syncValue()).toBe("Else ветка");
});
