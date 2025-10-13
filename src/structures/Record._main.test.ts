import { Late, Of } from "silentium";
import { expect, test, vi } from "vitest";
import { recordOf } from "./RecordOf";

test("Record._main.test", () => {
  const three = Late<string>("three");
  const recordSrc = recordOf({
    one: Of("one"),
    two: Of(2),
    three: three.event,
  });
  const g = vi.fn();
  recordSrc(g);

  expect(g).toHaveBeenLastCalledWith({
    one: "one",
    two: 2,
    three: "three",
  });

  three.use("three-changed");

  expect(g).toHaveBeenLastCalledWith({
    one: "one",
    two: 2,
    three: "three-changed",
  });
});
