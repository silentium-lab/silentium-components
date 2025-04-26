import { sourceSync } from "silentium";
import { expect, test } from "vitest";
import { path } from "../behaviors/Path";

test("Path.test", () => {
  const record = {
    name: "Peter",
    surname: "Parker",
  };
  const name = sourceSync(path(record, "name"));
  expect(name.syncValue()).toBe("Peter");
});
