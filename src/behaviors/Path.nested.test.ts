import { Catch, Empty, Of, Void } from "silentium";
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

test("Path default value", () => {
  const record = {
    name: "Peter",
    surname: "Parker",
    type: {
      name: "spider-man",
    },
  };
  const error = Catch(Empty(Path(record, "type.salary")).then(Void()));
  const g = vi.fn();
  error.then(g);
  expect(g).toHaveBeenLastCalledWith("Empty: no value in base message!");
});
