import { sourceOf, SourceSync } from "silentium";
import { Path } from "../behaviors/Path";
import { expect, test } from "vitest";

test("Path.test", () => {
  const record = sourceOf({
    name: "Peter",
    surname: "Parker",
  });
  const name = new SourceSync(new Path(record, sourceOf("name")));
  expect(name.syncValue()).toBe("Peter");
});
