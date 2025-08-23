import { From, Of } from "silentium";
import { expect, test, vi } from "vitest";
import { Path } from "./Path";

test("Path.nested.test", () => {
  const record = {
    name: "Peter",
    surname: "Parker",
    type: {
      name: "spider-man",
    },
  };
  const typeName = new Path(new Of(record), new Of("type.name"));
  const g = vi.fn();
  typeName.value(new From(g));
  expect(g).toHaveBeenLastCalledWith("spider-man");
});
