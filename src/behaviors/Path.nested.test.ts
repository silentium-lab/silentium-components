import { I, ownerSync } from "silentium";
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
  const typeName = ownerSync(path(I(record), I("type.name")));
  expect(typeName.syncValue()).toBe("spider-man");
});
