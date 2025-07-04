import { I, ownerSync } from "silentium";
import { expect, test } from "vitest";
import { path } from "../behaviors/Path";

test("Path.test", () => {
  const record = {
    name: "Peter",
    surname: "Parker",
  };
  const name = ownerSync(path(I(record), I("name")));
  expect(name.syncValue()).toBe("Peter");
});
