import { Of } from "silentium";
import { expect, test, vi } from "vitest";
import { Path } from "./Path";

test("Path._main.test", () => {
  const record = {
    name: "Peter",
    surname: "Parker",
  };
  const name = Path<string>(Of(record), Of("name"));
  const g = vi.fn();
  name(g);
  expect(g).toHaveBeenLastCalledWith("Peter");
});
