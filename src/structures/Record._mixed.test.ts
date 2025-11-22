import { Late } from "silentium";
import { expect, test, vi } from "vitest";

import { Record } from "./Record";

test("Record._mixed.test", () => {
  const $three = Late<string>("three");
  const $record = Record({
    one: "one",
    two: 2,
    three: $three,
  });
  const g = vi.fn();
  $record.then(g);

  expect(g).toHaveBeenLastCalledWith({
    one: "one",
    two: 2,
    three: "three",
  });

  $three.use("three-changed");

  expect(g).toHaveBeenLastCalledWith({
    one: "one",
    two: 2,
    three: "three-changed",
  });
});
