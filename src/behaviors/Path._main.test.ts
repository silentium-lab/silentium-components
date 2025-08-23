import { From, Of } from "silentium";
import { expect, test, vi } from "vitest";
import { Path } from "./Path";

test("Path._main.test", () => {
  const record = {
    name: "Peter",
    surname: "Parker",
  };
  const name = new Path<string>(new Of(record), new Of("name"));
  const g = vi.fn();
  name.value(new From(g));
  expect(g).toHaveBeenLastCalledWith("Peter");
});
