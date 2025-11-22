import { Of } from "silentium";
import { expect, test, vi } from "vitest";

import { Path } from "../behaviors/Path";

test("Path.nested.test", () => {
  const record = {
    name: "Peter",
    surname: "Parker",
    type: {
      name: "spider-man",
    },
  };
  const typeName = Path(Of(record), Of("type.name"));
  const g = vi.fn();
  typeName.then(g);
  expect(g).toHaveBeenLastCalledWith("spider-man");
});
