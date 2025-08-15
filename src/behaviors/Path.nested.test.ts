import { i } from "silentium";
import { expect, test, vi } from "vitest";
import { path } from "./Path";

test("Path.nested.test", () => {
  const record = {
    name: "Peter",
    surname: "Parker",
    type: {
      name: "spider-man",
    },
  };
  const typeName = path(i(record), i("type.name"));
  const g = vi.fn();
  typeName(g);
  expect(g).toHaveBeenLastCalledWith("spider-man");
});
