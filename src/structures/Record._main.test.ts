import { late, of } from "silentium";
import { expect, test, vi } from "vitest";
import { recordOf } from "./RecordOf";

test("Record._main.test", () => {
  const three = late<string>("three");
  const recordSrc = recordOf({
    one: of("one"),
    two: of(2),
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
