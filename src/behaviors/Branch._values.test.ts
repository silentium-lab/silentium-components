import { Of } from "silentium";
import { expect, test, vi } from "vitest";

import { Branch } from "./Branch";

test("Branch._values.test", () => {
  const res = Branch(true, Of("Then ветка"), Of("Else ветка"));

  const g = vi.fn();
  res.then(g);
  expect(g).toBeCalledWith("Then ветка");
});
