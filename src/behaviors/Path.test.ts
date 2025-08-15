import { i } from "silentium";
import { expect, test, vi } from "vitest";
import { path } from "../behaviors/Path";

test("Path.test", () => {
  const record = {
    name: "Peter",
    surname: "Parker",
  };
  const name = path<string>(i(record), i("name"));
  const g = vi.fn();
  name(g);
  expect(g).toHaveBeenLastCalledWith("Peter");
});
