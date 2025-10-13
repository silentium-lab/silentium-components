import { Of } from "silentium";
import { path } from "../behaviors/Path";
import { expect, test, vi } from "vitest";

test("Path.nested.test", () => {
  const record = {
    name: "Peter",
    surname: "Parker",
    type: {
      name: "spider-man",
    },
  };
  const typeName = path(Of(record), Of("type.name"));
  const g = vi.fn();
  typeName(g);
  expect(g).toHaveBeenLastCalledWith("spider-man");
});
