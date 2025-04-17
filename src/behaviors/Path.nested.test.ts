import { sourceOf, SourceSync } from "silentium";
import { Path } from "./Path";
import { expect, test } from "vitest";

test("Path.nested.test", () => {
  const record = sourceOf({
    name: "Peter",
    surname: "Parker",
    type: {
      name: "spider-man",
    },
  });
  const typeName = new SourceSync(new Path(record, sourceOf("type.name")));
  expect(typeName.syncValue()).toBe("spider-man");
});
