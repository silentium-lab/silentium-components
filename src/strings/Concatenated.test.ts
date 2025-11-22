import { Of } from "silentium";
import { expect, test, vi } from "vitest";

import { Concatenated } from "../strings/Concatenated";

test("Concatenated.test", () => {
  const $concatenated = Concatenated(
    [Of("one"), Of("two"), Of("three")],
    Of("-"),
  );
  const g = vi.fn();
  $concatenated.then(g);

  expect(g).toHaveBeenLastCalledWith("one-two-three");
});
