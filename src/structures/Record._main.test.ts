import { Late, Of, Tap } from "silentium";
import { expect, test, vi } from "vitest";
import { Record } from "./Record";

test("Record._main.test", () => {
  const $three = Late<string>("three");
  const $record = Record({
    one: Of("one"),
    two: Of(2),
    three: $three,
  });
  const g = vi.fn();
  $record.pipe(Tap(g));

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
