import { of } from "silentium";
import { expect, test, vi } from "vitest";
import { path } from "./Path";

test("Path._main.test", () => {
  const record = {
    name: "Peter",
    surname: "Parker",
  };
  const name = path<string>(of(record), of("name"));
  const g = vi.fn();
  name(g);
  expect(g).toHaveBeenLastCalledWith("Peter");
});
