import { Of, Tap } from "silentium";
import { expect, test, vi } from "vitest";
import { Path } from "./Path";

test("Path._main.test", () => {
  const record = {
    name: "Peter",
    surname: "Parker",
  };
  const name = Path<string>(Of(record), Of("name"));
  const g = vi.fn();
  name.pipe(Tap(g));
  expect(g).toHaveBeenLastCalledWith("Peter");
});
