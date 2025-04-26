import { sourceSync } from "silentium";
import { expect, test } from "vitest";
import { path } from "./Path";

test("Path.nested.test", () => {
  const record = {
    name: "Peter",
    surname: "Parker",
    type: {
      name: "spider-man",
    },
  };
  const typeName = sourceSync(path(record, "type.name"));
  expect(typeName.syncValue()).toBe("spider-man");
});
